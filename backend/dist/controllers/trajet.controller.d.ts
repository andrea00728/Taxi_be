import { Request, Response } from "express";
export declare class TrajetController {
    /**
     * Recherche de trajet optimisée avec:
     * - Gestion des correspondances multiples
     * - Calcul de score basé sur distance et nombre de changements
     * - Support de la recherche floue
     * - Limitation des résultats pertinents
     */
    static search(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Trouver les routes directes (sans correspondance)
     */
    private static findDirectRoutes;
    /**
     * Trouver les routes avec correspondances (algorithme simplifié de graphe)
     */
    private static findRoutesWithTransfers;
    /**
     * Générer une recommandation basée sur la route
     */
    private static getRecommendation;
    /**
     * Recherche d'arrêts à proximité (pour suggestions futures)
     */
    static searchNearby(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=trajet.controller.d.ts.map