import { Request, Response } from "express";
export declare class DistrictController {
    /**
     * Retrieves all districts from the database, including their associated lignes and arrets.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the districts.
     */
    static getAllDistrict(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves a district by its ID, including its associated lignes and arrets.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the district.
     */
    static getDistrictById(req: Request, res: Response): Promise<void>;
    /**
     * Creates a new district and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the district.
     */
    static createDistrict(req: Request, res: Response): Promise<void>;
    /**
     * Deletes a district by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the district.
     */
    static removeDistrict(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves the number of lignes associated with a district by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the count.
     */
    static ligneCountByDistrict(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=district.controller.d.ts.map