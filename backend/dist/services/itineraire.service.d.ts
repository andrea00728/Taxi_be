import { Itineraire } from "../entities/Itineraire.js";
export declare class ItineraireService {
    private itineraireRepository;
    /**
     * Retrieves all itineraires from the database, including their associated lignes.
     *
     * @returns {Promise<Itineraire[]>} A promise that resolves to an array of Itineraire objects.
     */
    getAllItineraire(): Promise<Itineraire[]>;
    /**
     * Retrieves an itineraire by its ID, including its associated ligne.
     *
     * @param {number} id The ID of the itineraire to retrieve.
     * @returns {Promise<Itineraire | null>} A promise that resolves to the retrieved Itineraire object, or null if no itineraire is found.
     */
    getItinById(id: number): Promise<Itineraire | null>;
    /**
     * Creates a new itineraire and persists it to the database.
     *
     * @param {Partial<Itineraire>} data The data of the itineraire to create.
     * @returns {Promise<Itineraire>} A promise that resolves to the created Itineraire object.
     */
    createItineraires(data: Partial<Itineraire>): Promise<Itineraire>;
    /**
     * Updates an itineraire by its ID.
     *
     * @param {number} id The ID of the itineraire to update.
     * @param {Partial<Itineraire>} data The data to update the itineraire with.
     * @returns {Promise<Itineraire>} A promise that resolves to the updated Itineraire object.
     */
    updateItin(id: number, data: Partial<Itineraire>): Promise<Itineraire | null>;
    /**
     * Deletes an itineraire by its ID.
     *
     * @param {number} id The ID of the itineraire to delete.
     * @returns {Promise<void>} A promise that resolves when the itineraire has been deleted.
     */
    deleteItin(id: number): Promise<import("typeorm").DeleteResult>;
    /**
     * Retrieves all itineraires associated with a given ligne.
     *
     * @param {number} ligneId The ID of the ligne to retrieve itineraires for.
     * @returns {Promise<Itineraire[]>} A promise that resolves to an array of Itineraire objects.
     */
    findByLIgne(ligneId: number): Promise<Itineraire[]>;
}
//# sourceMappingURL=itineraire.service.d.ts.map