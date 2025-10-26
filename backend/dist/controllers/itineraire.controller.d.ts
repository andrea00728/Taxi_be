import { Request, Response } from "express";
export declare class ItineraireController {
    /**
     * Retrieves all itineraires from the database.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the itineraires.
     */
    static FindAllItineraire(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves an itineraire by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the itineraire.
     */
    static FindItineraireById(req: Request, res: Response): Promise<void>;
    /**
     * Creates a new itineraire and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the itineraire.
     */
    static CreateItineraire(req: Request, res: Response): Promise<void>;
    /**
     * Updates an itineraire by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while updating the itineraire.
     */
    static UpdateItineraire(req: Request, res: Response): Promise<void>;
    /**
     * Deletes an itineraire by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the itineraire.
     */
    static RemoveItineraire(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=itineraire.controller.d.ts.map