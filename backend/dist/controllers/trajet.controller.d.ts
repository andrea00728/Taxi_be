import { Request, Response } from "express";
export declare class TrajetController {
    /**
     * Calculate the distance between two points on the Earth's surface
     * using the Haversine formula.
     *
     * @param {number} lat1 Latitude of the first point
     * @param {number} lon1 Longitude of the first point
     * @param {number} lat2 Latitude of the second point
     * @param {number} lon2 Longitude of the second point
     * @returns {number} Distance between the two points in meters
     */
    private static calculateDistance;
    /**
     * Returns the index of an arret in a ligne's list of arrets.
     *
     * @param {number} arretId The ID of the arret to find.
     * @param {any[]} ligneArrets The list of arrets to search in.
     * @returns {number} The index of the arret in the list, or -1 if not found.
     */
    private static getArretIndex;
    /**
     * Vérifie que les indices sont valides ET différents
     * @param {number} startIndex Index de départ
     * @param {number} endIndex Index de fin
     * @returns {boolean} True si les indices sont valides ET différents, false sinon
     */
    private static isValidDirection;
    /**
     * Finds the nearest arret to a given target latitude and longitude.
     *
     * @param {number} targetLat The target latitude.
     * @param {number} targetLon The target longitude.
     * @param {any[]} arrets The list of arrets to search in.
     * @returns {ArretWithDistance | null} The nearest arret with its distance, or null if not found.
     */
    private static findNearestArret;
    /**
     * Recherche de trajets intelligents entre un départ et une destination.
     * Les paramètres de recherche sont les suivants:
     * - depart: le nom du départ (recherche floue)
     * - destination: le nom de la destination (recherche floue)
     * - maxTransfers: le nombre maximum de correspondances autorisées (0 pour ignorer les correspondances)
     * - maxWalkingDistance: la distance maximum de marche en mètres (0 pour ignorer la distance de marche)
     * - limit: le nombre maximum de résultats à retourner
     *
     * @param {Request} req La requête HTTP
     * @param {Response} res La réponse HTTP
     * @returns {Promise<void>} La promesse de la requête
     */
    static search(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Recherche de routes directes entre les arrêts de départ et de destination
     *
     * @param departArrets Les arrêts de départ
     * @param destArrets Les arrêts de destination
     * @param allLignes Toutes les lignes avec leurs arrêts
     * @returns Une promesse de routes directes (RouteOption[])
     */
    private static findDirectRoutes;
    /**
     * Recherche de trajets intelligents entre un départ et une destination
     * en prenant en compte les correspondances et les distances de marche.
     * Les paramètres de recherche sont les suivants:
     * - departArrets: les arrêts de départ (recherche floue)
     * - destArrets: les arrêts de destination (recherche floue)
     * - allLignes: toutes les lignes du réseau
     * - maxWalkingDistance: la distance maximum de marche en mètres (0 pour ignorer la distance de marche)
     * - maxTransfers: le nombre maximum de correspondances autorisées (0 pour ignorer les correspondances)
     *
     * @returns Une promesse qui résout en un tableau de RouteOption
     */
    private static findIntelligentTransferRoutes;
    /**
     * Cherche les noms d'arrêts qui commencent par les 3 premiers caractères de la query.
     * Retourne un tableau de 5 suggestions maximum.
     *
     * @param {string} query La chaîne de caractères à chercher.
     * @param {ArretService} arretSvc Le service des arrêts.
     * @returns {Promise<string[]>} Un promise qui résout à un tableau de chaînes de caractères.
     */
    private static getSuggestions;
}
//# sourceMappingURL=trajet.controller.d.ts.map