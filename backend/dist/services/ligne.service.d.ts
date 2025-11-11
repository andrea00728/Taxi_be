import { Ligne } from "../entities/Ligne.js";
export declare class LigneService {
    private ligneRepository;
    /**
     * Retrieves all lignes with their associated arrets and itineraires.
     *
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    getAllLignes(): Promise<Ligne[]>;
    /**
     * Retrieves all lignes belonging to a given district, including their associated arrets and itineraires.
     *
     * @param {number} districtId The ID of the district to retrieve lignes for.
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    getLigneByDistrict(districtId: number): Promise<Ligne[]>;
    /**
     * Retrieves all lignes belonging to a given user, including their associated arrets and itineraires.
     *
     * @param {string} firebase_uid The Firebase UID of the user to retrieve lignes for.
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of Ligne objects.
     */
    getLigneUser(firebase_uid: string): Promise<Ligne[]>;
    /**
     * Retrieves a ligne by its ID, including its associated arrets and itineraires.
     *
     * @param {number} id The ID of the ligne to retrieve.
     * @returns {Promise<Ligne | null>} A promise that resolves to the retrieved Ligne object, or null if no ligne is found.
     */
    getLigneById(id: number): Promise<Ligne | null>;
    /**
     * Creates a new ligne and persists it to the database.
     *
     * @param {Partial<Ligne>} data The data of the ligne to create.
     * @returns {Promise<Ligne>} A promise that resolves to the created Ligne object.
     */
    createLign(data: Partial<Ligne> & {
        district_id?: number;
    }, firebaseUid: string): Promise<Ligne>;
    /**
     * Updates a ligne by its ID.
     *
     * @param {number} id The ID of the ligne to update.
     * @param {Partial<Ligne>} data The data to update the ligne with.
     * @returns {Promise<Ligne>} A promise that resolves to the updated Ligne object.
     */
    updateLigne(id: number, data: Partial<Ligne>): Promise<Ligne | null>;
    updateStatusLigne(id: number, data: Partial<Ligne>): Promise<Ligne | null>;
    /**
     * Deletes a ligne by its ID.
     *
     * @param {number} id The ID of the ligne to delete.
     * @returns {Promise<void>} A promise that resolves when the ligne has been deleted.
     */
    deleteLigne(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=ligne.service.d.ts.map