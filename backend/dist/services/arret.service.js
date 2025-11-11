"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArretService = void 0;
const data_source_js_1 = require("../config/data-source.js");
const Arret_js_1 = require("../entities/Arret.js");
const Ligne_js_1 = require("../entities/Ligne.js");
class ArretService {
    constructor() {
        this.arretRepository = data_source_js_1.AppDataSource.getRepository(Arret_js_1.Arret);
        this.ligneRepository = data_source_js_1.AppDataSource.getRepository(Ligne_js_1.Ligne);
    }
    /**
     * Retrieves all arrets from the database, including their associated lignes.
     *
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    async getAllArrets() {
        return await this.arretRepository.find({ relations: ["ligne"] });
    }
    /**
     * Retrieves an arret by its ID, including its associated ligne.
     *
     * @param {number} id The ID of the arret to retrieve.
     * @returns {Promise<Arret | null>} A promise that resolves to the retrieved Arret object, or null if no arret is found.
     */
    async getArretById(id) {
        return await this.arretRepository.findOne({ where: { id },
            relations: ["ligne"] });
    }
    /**
     * Retrieves all arrets associated with a given Firebase user ID.
     * The associated ligne of each arret is also included in the result.
     *
     * @param {string} firebase_uid The Firebase user ID to retrieve arrets for.
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    async getArretByUser(firebase_uid) {
        return this.arretRepository.find({
            where: { firebase_uid },
            relations: ["ligne"]
        });
    }
    /**
     * Creates a new arret and persists it to the database.
     * If the arret has a "nomigne" property, it is used to retrieve the associated ligne
     * by its name. If the ligne does not exist, an error is thrown.
     *
     * @param {Partial<Arret> & {nomigne?: string}} data The data of the arret to create.
     * @param {string} firebaseUid The Firebase user ID associated with the arret.
     * @returns {Promise<Arret>} A promise that resolves to the created Arret object.
     * @throws {Error} If the ligne associated with the arret does not exist.
     */
    //   async createArret(data: Partial<Arret> & { nomligne?: string },firebaseUid:string) {
    // //   if (data.nomligne) {
    // //     data.ligne = { nom: data.nomligne } as Ligne;
    // //     delete data.nomligne;
    // //   }
    // if(data.nomligne){
    //     const ligne = await this.ligneRepository.findOne({
    //         where:{nom:data.nomligne},
    //     });
    //     if(!ligne){
    //         throw new Error(`ligne ${data.nomligne} n'existe pas`);
    //     }
    //     data.ligne=ligne;
    //     delete data.nomligne;
    // }
    //   const arret = this.arretRepository.create({
    //     ...data,
    //     firebase_uid:firebaseUid
    //   });
    //   return this.arretRepository.save(arret);
    // }
    async createArret(data, firebaseUid) {
        if (!data.nomligne) {
            throw new Error("nomligne est requis");
        }
        if (!data.nom || data.latitude == null || data.longitude == null) {
            throw new Error("nom, latitude, longitude sont obligatoires");
        }
        // 1 ✅ Trouver toutes les lignes portant ce nom
        const lignes = await this.ligneRepository.find({
            where: { nom: data.nomligne },
            relations: ["arrets"],
        });
        if (lignes.length === 0) {
            throw new Error(`La ligne '${data.nomligne}' n'existe pas`);
        }
        // 2 ✅ Créer l’arrêt
        const arret = this.arretRepository.create({
            nom: data.nom,
            latitude: data.latitude,
            longitude: data.longitude,
            firebase_uid: firebaseUid,
        });
        const newArret = await this.arretRepository.save(arret);
        // 3 ✅ Ajouter l’arrêt à toutes les lignes
        for (const ligne of lignes) {
            if (!ligne.arrets)
                ligne.arrets = []; // sécurité
            ligne.arrets.push(newArret);
            await this.ligneRepository.save(ligne);
        }
        return {
            message: `Arrêt ajouté à ${lignes.length} ligne(s) nommées '${data.nomligne}'`,
            arret: newArret,
        };
    }
    /**
     * Updates an arret by its ID.
     *
     * @param {number} id The ID of the arret to update.
     * @param {Partial<Arret>} data The data to update the arret with.
     * @returns {Promise<Arret>} A promise that resolves to the updated Arret object.
     */
    async updateArret(id, data) {
        await this.arretRepository.update({ id }, data);
        return this.getArretById(id);
    }
    /**
     * Deletes an arret by its ID.
     *
     * @param {number} id The ID of the arret to delete.
     * @returns {Promise<void>} A promise that resolves when the arret has been deleted.
     */
    async deleteArret(id) {
        return this.arretRepository.delete(id);
    }
    /**
     * Retrieves all arrets with a name that matches the given name.
     * The search is case-insensitive.
     *
     * @param {string} name The name to search for.
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    async findByName(name) {
        return await this.arretRepository.createQueryBuilder("arret")
            .where("LOWER(arret.nom) LIKE LOWER(:name)", { name: `%${name}%` })
            .leftJoinAndSelect("arret.ligne", "ligne")
            .getMany();
    }
    /**
     * Trouver tous les arrêts d'une ligne spécifique
     *
     * @param {number} ligneId L'ID de la ligne
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    async findByLigneId(ligneId) {
        try {
            return await this.arretRepository.find({
                where: { ligne: { id: ligneId } },
                relations: ["ligne"],
                order: { nom: "ASC" },
            });
        }
        catch (error) {
            console.error("Erreur lors de la recherche des arrêts par ligne:", error);
            throw new Error("Impossible de récupérer les arrêts de cette ligne");
        }
    }
    /**
     * Trouver toutes les lignes qui passent par un arrêt (par nom)
     *
     * @param {string} arretName Le nom de l'arrêt à rechercher
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of unique Ligne objects.
     */
    async findLignesByArretName(arretName) {
        try {
            // Rechercher les arrêts correspondants au nom
            const arrets = await this.arretRepository
                .createQueryBuilder("arret")
                .where("LOWER(arret.nom) LIKE LOWER(:name)", {
                name: `%${arretName}%`,
            })
                .leftJoinAndSelect("arret.ligne", "ligne")
                .getMany();
            // Extraire les lignes uniques
            const lignesMap = new Map();
            arrets.forEach((arret) => {
                if (arret.ligne && !lignesMap.has(arret.ligne.id)) {
                    lignesMap.set(arret.ligne.id, arret.ligne);
                }
            });
            return Array.from(lignesMap.values());
        }
        catch (error) {
            console.error("Erreur lors de la recherche des lignes par arrêt:", error);
            throw new Error("Impossible de récupérer les lignes pour cet arrêt");
        }
    }
    /**
     * Trouver les arrêts à proximité d'un point GPS (formule de Haversine)
     *
     * @param {number} lat La latitude du point de recherche
     * @param {number} lon La longitude du point de recherche
     * @param {number} [radius=500] Le rayon de recherche en mètres
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects sorted by distance.
     */
    async findNearby(lat, lon, radius = 500) {
        try {
            const allArrets = await this.arretRepository
                .createQueryBuilder("arret")
                .where("arret.latitude IS NOT NULL")
                .andWhere("arret.longitude IS NOT NULL")
                .leftJoinAndSelect("arret.ligne", "ligne")
                .getMany();
            const nearbyArrets = allArrets.filter((arret) => {
                // Pas besoin de parseFloat si latitude/longitude sont déjà des numbers
                const distance = this.calculateDistance(lat, lon, arret.latitude, arret.longitude);
                return distance <= radius;
            });
            nearbyArrets.sort((a, b) => {
                const distA = this.calculateDistance(lat, lon, a.latitude, a.longitude);
                const distB = this.calculateDistance(lat, lon, b.latitude, b.longitude);
                return distA - distB;
            });
            return nearbyArrets;
        }
        catch (error) {
            console.error("Erreur lors de la recherche des arrêts à proximité:", error);
            throw new Error("Impossible de récupérer les arrêts à proximité");
        }
    }
    /**
     * Calculer la distance entre deux points sur la surface de la Terre
     * en utilisant la formule de Haversine.
     * @param {number} lat1 Latitude du premier point
     * @param {number} lon1 Longitude du premier point
     * @param {number} lat2 Latitude du second point
     * @param {number} lon2 Longitude du second point
     * @returns {number} Distance entre les deux points en mètres
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Rayon de la Terre en mètres
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
exports.ArretService = ArretService;
//# sourceMappingURL=arret.service.js.map