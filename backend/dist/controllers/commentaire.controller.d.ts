import { AuthRequest } from "../middlewares/authMiddleware";
import { Request, Response } from "express";
export declare class CommentaireController {
    static getComsRecent(req: Request, res: Response): Promise<void>;
    static getAll_Coms(req: Request, res: Response): Promise<void>;
    static getAll_comsBy_Ligne(req: Request, res: Response): Promise<void>;
    static create_Coms(req: AuthRequest, res: Response): Promise<void>;
    static deleteCOoms(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=commentaire.controller.d.ts.map