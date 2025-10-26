import { Arret } from "../entities/Arret.js";
export declare class ArretService {
    private arretRepository;
    /**
     * Retrieves all arrets from the database, including their associated lignes.
     *
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    getAllArrets(): Promise<Arret[]>;
    /**
     * Retrieves an arret by its ID, including its associated ligne.
     *
     * @param {number} id The ID of the arret to retrieve.
     * @returns {Promise<Arret | null>} A promise that resolves to the retrieved Arret object, or null if no arret is found.
     */
    getArretById(id: number): Promise<Arret | null>;
    /**
     * Creates a new arret and persists it to the database.
     * If a ligneId is provided in the data, it will be used to create a
     * Ligne object and associate it with the arret.
     *
     * @param {Partial<Arret> & { ligneId?: number }} data The data of the arret to create.
     * @returns {Promise<Arret>} A promise that resolves to the created Arret object.
     */
    createArret(data: Partial<Arret> & {
        ligneId?: number;
    }): Promise<Arret>;
    /**
     * Updates an arret by its ID.
     *
     * @param {number} id The ID of the arret to update.
     * @param {Partial<Arret>} data The data to update the arret with.
     * @returns {Promise<Arret>} A promise that resolves to the updated Arret object.
     */
    updateArret(id: number, data: Partial<Arret>): Promise<Arret | null>;
    /**
     * Deletes an arret by its ID.
     *
     * @param {number} id The ID of the arret to delete.
     * @returns {Promise<void>} A promise that resolves when the arret has been deleted.
     */
    deleteArret(id: number): Promise<import("typeorm").DeleteResult>;
    /**
     * Retrieves all arrets with a name that matches the given name.
     * The search is case-insensitive.
     *
     * @param {string} name The name to search for.
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    findByName(name: string): Promise<Arret[]>;
}
//# sourceMappingURL=arret.service.d.ts.map