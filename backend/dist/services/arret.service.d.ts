import { Arret } from "../entities/Arret.js";
import { Ligne } from "../entities/Ligne.js";
export declare class ArretService {
    private arretRepository;
    private ligneRepository;
    /**
     * Retrieves all arrets from the database, including their associated lignes.
     *
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    getAllArrets(): Promise<Arret[]>;
    /**
     * Normalizes a given string by decomposing accented characters, removing accents and apostrophes, normalizing spaces, converting to lowercase, and trimming.
     * @param {string} str The string to normalize.
     * @returns {string} The normalized string.
     */
    private normalizeString;
    /**
     * Retrieves an arret by its ID, including its associated ligne.
     *
     * @param {number} id The ID of the arret to retrieve.
     * @returns {Promise<Arret | null>} A promise that resolves to the retrieved Arret object, or null if no arret is found.
     */
    getArretById(id: number): Promise<Arret | null>;
    /**
     * Retrieves all arrets associated with a given Firebase user ID.
     * The associated ligne of each arret is also included in the result.
     *
     * @param {string} firebase_uid The Firebase user ID to retrieve arrets for.
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    getArretByUser(firebase_uid: string): Promise<Arret[]>;
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
    createArret(data: Partial<Arret> & {
        nomligne?: string;
    }, firebaseUid: string): Promise<{
        message: string;
        arret: Arret;
    }>;
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
    * Recherche d'arrêts avec normalisation (ignore accents, apostrophes, casse)
    * @param {string} name Le nom à rechercher
    * @returns {Promise<Arret[]>} Une liste d'arrêts correspondants
    */
    findByName(name: string): Promise<Arret[]>;
    /**
     * Trouver tous les arrêts d'une ligne spécifique
     *
     * @param {number} ligneId L'ID de la ligne
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    findByLigneId(ligneId: number): Promise<Arret[]>;
    /**
     * Trouver toutes les lignes qui passent par un arrêt (par nom)
     *
     * @param {string} arretName Le nom de l'arrêt à rechercher
     * @returns {Promise<Ligne[]>} A promise that resolves to an array of unique Ligne objects.
     */
    findLignesByArretName(arretName: string): Promise<Ligne[]>;
    /**
     * Trouver les arrêts à proximité d'un point GPS (formule de Haversine)
     *
     * @param {number} lat La latitude du point de recherche
     * @param {number} lon La longitude du point de recherche
     * @param {number} [radius=500] Le rayon de recherche en mètres
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects sorted by distance.
     */
    findNearby(lat: number, lon: number, radius?: number): Promise<Arret[]>;
    /**
     * Calculer la distance entre deux points sur la surface de la Terre
     * en utilisant la formule de Haversine.
     * @param {number} lat1 Latitude du premier point
     * @param {number} lon1 Longitude du premier point
     * @param {number} lat2 Latitude du second point
     * @param {number} lon2 Longitude du second point
     * @returns {number} Distance entre les deux points en mètres
     */
    private calculateDistance;
}
//# sourceMappingURL=arret.service.d.ts.map