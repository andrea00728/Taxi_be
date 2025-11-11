"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LigneService = void 0;
const data_source_js_1 = require("../config/data-source.js");
const Ligne_js_1 = require("../entities/Ligne.js");
class LigneService {
    constructor() {
        this.ligneRepository = data_source_js_1.AppDataSource.getRepository(Ligne_js_1.Ligne);
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
     *
     * @param {Partial<Ligne>} data The data of the ligne to create.
     * @returns {Promise<Ligne>} A promise that resolves to the created Ligne object.
     */
    async createLign(data, firebaseUid) {
        if (data.district_id) {
            data.district = { id: data.district_id };
            delete data.district_id;
        }
        const ligne = this.ligneRepository.create({
            ...data,
            firebase_uid: firebaseUid
        });
        return await this.ligneRepository.save(ligne);
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
    async updateStatusLigne(id, data) {
        if (!data.statut) {
            throw new Error("Statut de la ligne manquant");
        }
        await this.ligneRepository.update({ id }, { statut: data.statut });
        return this.getLigneById(id);
    }
    /**
     * Deletes a ligne by its ID.
     *
     * @param {number} id The ID of the ligne to delete.
     * @returns {Promise<void>} A promise that resolves when the ligne has been deleted.
     */
    async deleteLigne(id) {
        return await this.ligneRepository.delete({ id });
    }
}
exports.LigneService = LigneService;
//# sourceMappingURL=ligne.service.js.map