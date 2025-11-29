import { Request, Response } from "express";
export declare class TrajetController {
    /**
     * Calcule la distance entre deux points GPS avec la formule de Haversine
     */
    private static calculateDistance;
    private static getArretIndex;
    private static isValidDirection;
    private static findNearestArret;
    static search(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private static findDirectRoutes;
    private static findIntelligentTransferRoutes;
    private static getSuggestions;
}
//# sourceMappingURL=trajet.controller.d.ts.map