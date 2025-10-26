import { Request, Response } from "express";
/**
 * Recherche très simple :
 * - on cherche les arrêts dont le nom contient le param départ et destination,
 * - on propose les lignes communes ou les lignes qui passent par ces arrêts.
 * (Ceci est un point de départ ; pour algo optimal utiliser graphe + Dijkstra/A*)
 */
export declare class TrajetController {
    static search(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=trajet.controller.d.ts.map