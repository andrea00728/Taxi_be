"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraireService = void 0;
const data_source_js_1 = require("../config/data-source.js");
const Itineraire_js_1 = require("../entities/Itineraire.js");
class ItineraireService {
    constructor() {
        this.itineraireRepository = data_source_js_1.AppDataSource.getRepository(Itineraire_js_1.Itineraire);
    }
    /**
     * Retrieves all itineraires from the database, including their associated lignes.
     *
     * @returns {Promise<Itineraire[]>} A promise that resolves to an array of Itineraire objects.
     */
    async getAllItineraire() {
        return await this.itineraireRepository.find({ relations: ["ligne"] });
    }
    /**
     * Retrieves an itineraire by its ID, including its associated ligne.
     *
     * @param {number} id The ID of the itineraire to retrieve.
     * @returns {Promise<Itineraire | null>} A promise that resolves to the retrieved Itineraire object, or null if no itineraire is found.
     */
    async getItinById(id) {
        return await this.itineraireRepository.findOne({ where: { id },
            relations: ["ligne"] });
    }
    /**
     * Creates a new itineraire and persists it to the database.
     *
     * @param {Partial<Itineraire>} data The data of the itineraire to create.
     * @returns {Promise<Itineraire>} A promise that resolves to the created Itineraire object.
     */
    async createItineraires(data) {
        const itineraire = this.itineraireRepository.create(data);
        return await this.itineraireRepository.save(itineraire);
    }
    /**
     * Updates an itineraire by its ID.
     *
     * @param {number} id The ID of the itineraire to update.
     * @param {Partial<Itineraire>} data The data to update the itineraire with.
     * @returns {Promise<Itineraire>} A promise that resolves to the updated Itineraire object.
     */
    async updateItin(id, data) {
        await this.itineraireRepository.update({ id }, data);
        return this.getItinById(id);
    }
    /**
     * Deletes an itineraire by its ID.
     *
     * @param {number} id The ID of the itineraire to delete.
     * @returns {Promise<void>} A promise that resolves when the itineraire has been deleted.
     */
    async deleteItin(id) {
        return await this.itineraireRepository.delete({ id });
    }
    /**
     * Retrieves all itineraires associated with a given ligne.
     *
     * @param {number} ligneId The ID of the ligne to retrieve itineraires for.
     * @returns {Promise<Itineraire[]>} A promise that resolves to an array of Itineraire objects.
     */
    async findByLIgne(ligneId) {
        return await this.itineraireRepository.find({ where: { ligne: { id: ligneId } },
            relations: ["ligne"] });
    }
}
exports.ItineraireService = ItineraireService;
//# sourceMappingURL=itineraire.service.js.map