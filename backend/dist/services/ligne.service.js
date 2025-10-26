import { AppDataSource } from "../config/data-source.js";
import { Ligne } from "../entities/Ligne.js";
export class LigneService {
    constructor() {
        this.ligneRepository = AppDataSource.getRepository(Ligne);
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
    async createLign(data) {
        if (data.district_id) {
            data.district = { id: data.district_id };
            delete data.district_id;
        }
        const ligne = this.ligneRepository.create(data);
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
//# sourceMappingURL=ligne.service.js.map