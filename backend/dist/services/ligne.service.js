"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LigneService = void 0;
const data_source_js_1 = require("../config/data-source.js");
const Ligne_js_1 = require("../entities/Ligne.js");
const notification_js_1 = require("../entities/notification.js");
const server_js_1 = require("../server.js");
class LigneService {
    constructor() {
        this.ligneRepository = data_source_js_1.AppDataSource.getRepository(Ligne_js_1.Ligne);
        this.notificationGat = server_js_1.notificationGateway;
        this.notificationRepo = data_source_js_1.AppDataSource.getRepository(notification_js_1.NotificationEntity);
    }
    /**
     * Retrieves all lignes with their associated arrets and itineraires.
     *
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    async getAllLignes() {
        return await this.ligneRepository.find({ relations: ["arrets", "itineraires"] });
    }
    /**
     * Retrieves all lignes belonging to a given district, including their associated arrets and itineraires.
     *
     * @param {number} districtId The ID of the district to retrieve lignes for.
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    async getLigneByDistrict(districtId) {
        return this.ligneRepository.find({ where: { district: { id: districtId } },
            relations: ["district", "arrets", "itineraires"] });
    }
    /**
     * Retrieves all lignes that have been accepted and include their associated arrets.
     *
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    async findAllWithArrets() {
        return await this.ligneRepository.find({
            where: { statut: Ligne_js_1.StatutLigne.Accepted },
            relations: ["arrets"]
        });
    }
    /**
     * Retrieves all lignes belonging to a given user, including their associated arrets and itineraires.
     *
     * @param {string} firebase_uid The Firebase UID of the user to retrieve lignes for.
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    async getLigneUser(firebase_uid) {
        return this.ligneRepository.find({ where: { firebase_uid }, relations: ["arrets", "itineraires"] });
    }
    /**
     * Retrieves a ligne by its ID, including its associated arrets and itineraires.
     *
     * @param {number} id The ID of the ligne to retrieve.
     * @returns {Promise<Ligne | null>} A promise that resolves to the retrieved Ligne object, or null if no ligne is found.
     */
    async getLigneById(id) {
        return await this.ligneRepository.findOne({ where: { id }, relations: ["arrets", "itineraires"] });
    }
    /**
     * Creates a new ligne and persists it to the database.
     * If a district_id is provided, it is used to create a District object.
     * The statut of the ligne depends on the userRole provided: if the user is an admin, the statut is set to Accepted, otherwise it is set to Attent.
     * A notification is also created and persisted to the database, and an event is emitted to the admin to notify them of the new ligne.
     *
     * @param {Partial<Ligne> & {district_id?:number}} data The data of the ligne to be created.
     * @param {string} firebaseUid The Firebase UID of the user who created the ligne.
     * @param {string} userRole The role of the user who created the ligne.
     * @returns {Promise<Ligne>} A promise that resolves to the created Ligne object.
     */
    async createLign(data, firebaseUid, userRole) {
        if (data.district_id) {
            data.district = { id: data.district_id };
            delete data.district_id;
        }
        const statut = userRole === "admin" ? Ligne_js_1.StatutLigne.Accepted : Ligne_js_1.StatutLigne.Attent;
        const ligne = this.ligneRepository.create({
            ...data,
            firebase_uid: firebaseUid,
            statut: statut,
        });
        const saveLigne = await this.ligneRepository.save(ligne);
        const notif = this.notificationRepo.create({
            title: "Nouvelle Ligne creee",
            message: `La ligne ${data.nom} du district ${data.district} a été mise en attente de validation`,
            type: 'info',
            date: new Date(),
        });
        await this.notificationRepo.save(notif);
        this.notificationGat?.emitNotifRegisterToAdmin({
            ...notif,
            date: notif.date.toISOString(),
        });
        return saveLigne;
    }
    /**
     * Updates a ligne by its ID.
     *
     * @param {number} id The ID of the ligne to update.
     * @param {Partial<Ligne>} data The data to update the ligne with.
     * @returns {Promise<Ligne>} A promise that resolves to the updated Ligne object.
     */
    async updateLigne(id, data) {
        await this.ligneRepository.update({ id }, data);
        return this.getLigneById(id);
    }
    /**
     * Updates the status of a ligne by its ID.
     *
     * @throws {Error} If the status of the ligne is not provided in the data.
     * @returns {Promise<Ligne>} A promise that resolves to the updated Ligne object.
     */
    // Dans ligne.service.ts
    async updateStatusLigne(id, data) {
        console.log(` Début updateStatusLigne pour ID ${id}`);
        if (!data.statut) {
            throw new Error("Statut de la ligne manquant");
        }
        try {
            // 1. Mise à jour de la ligne
            await this.ligneRepository.update({ id }, { statut: data.statut });
            const update_Status = await this.getLigneById(id);
            if (!update_Status) {
                console.error(" Erreur: Ligne introuvable après update");
                return null;
            }
            // 2. Création de la notif
            const notif = this.notificationRepo.create({
                title: 'Changement de statut',
                message: `Le statut de la ligne ${update_Status.nom} est passé à ${data.statut}`,
                type: 'info',
                date: new Date(),
            });
            // 3. Sauvegarde Notif (AVEC GESTION D'ERREUR DÉDIÉE)
            try {
                console.log(" Tentative sauvegarde notification...");
                const savedNotif = await this.notificationRepo.save(notif);
                console.log(" Notification update sauvegardée (ID:", savedNotif.id, ")");
                if (server_js_1.notificationGateway) {
                    server_js_1.notificationGateway.emitNotification({
                        ...savedNotif, // Utilise l'objet retourné par save
                        date: savedNotif.date.toISOString(),
                    });
                    console.log(" Notification update envoyée via Socket");
                }
                else {
                    console.error("Socket non disponible (problème d'import circulaire)");
                }
            }
            catch (notifError) {
                console.error(" ERREUR CRITIQUE SAUVEGARDE NOTIFICATION:", notifError);
            }
            return update_Status;
        }
        catch (error) {
            console.error(" Erreur générale dans updateStatusLigne:", error);
            throw error;
        }
    }
    /**
     * Deletes a ligne by its ID.
     *
     * @param {number} id The ID of the ligne to delete.
     * @returns {Promise<void>} A promise that resolves when the ligne has been deleted.
     */
    async deleteLigne(id) {
        try {
            const ligne = await this.ligneRepository.findOneBy({ id });
            if (!ligne) {
                throw new Error(`la ligne ${id} est introuvable`);
            }
            const RemoveLigne = await this.ligneRepository.delete({ id });
            return RemoveLigne;
        }
        catch (error) {
            console.error(`Erreur lors de la suppression du ligne ave l'id #${id}`);
            throw error;
        }
        // return await this.ligneRepository.delete({id});
    }
}
exports.LigneService = LigneService;
//# sourceMappingURL=ligne.service.js.map