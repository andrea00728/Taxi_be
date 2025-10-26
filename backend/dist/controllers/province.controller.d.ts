import { Request, Response } from "express";
export declare class ProvinceController {
    /**
     * Retrieves all provinces from the database, including their associated regions, districts and lignes.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the provinces.
     */
    static getAllProvinces(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves a province by its ID, including its associated regions, districts and lignes.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the province.
     */
    static getProvinceById(req: Request, res: Response): Promise<void>;
    /**
     * Creates a new province and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the province.
     */
    static createProvince(req: Request, res: Response): Promise<void>;
    /**
     * Deletes a province by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the province.
     */
    static removeProvince(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=province.controller.d.ts.map