import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Request, Response } from "express";
export declare class LigneController {
    /**
     * Retrieves all lignes from the database, including their associated arrets and itineraires.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the lignes.
     */
    static getAllLignes(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves all lignes belonging to a given user, including their associated arrets and itineraires.
     *
     * @param {AuthRequest} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the lignes.
     */
    static getLigneByUser(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Retrieves a ligne by its ID, including its associated arrets and itineraires.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the ligne.
     */
    static getLigneById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Creates a new ligne and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the ligne.
     */
    static createLigne(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Updates a ligne by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while updating the ligne.
     */
    static updateLigne(req: Request, res: Response): Promise<void>;
    static updateStatusLigne(req: Request, res: Response): Promise<void>;
    /**
     * Deletes a ligne by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the ligne.
     */
    static deleteLigne(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ligne.controller.d.ts.map