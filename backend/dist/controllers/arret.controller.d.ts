import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Request, Response } from "express";
export declare class ArretController {
    /**
     * Retrieves all arrets from the database, including their associated lignes.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the arrets.
     */
    static getAllArret(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves all arrets belonging to a given user, including their associated lignes.
     *
     * @param {AuthRequest} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the arrets.
     */
    static getArretByUser(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Retrieves an arret by its ID, including its associated ligne.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the arret.
     */
    static getArretById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Creates a new arret and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the arret.
     */
    static createArret(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Updates an arret by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while updating the arret.
     */
    static updateArret(req: Request, res: Response): Promise<void>;
    /**
     * Deletes an arret by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the arret.
     */
    static RemoveArret(req: Request, res: Response): Promise<void>;
    /**
  * Recherche d'arrêts pour l'autocomplétion
  */
    static search(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=arret.controller.d.ts.map