import { Request, Response } from "express";
export declare class RegionController {
    /**
     * Retrieves all regions from the database.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the regions.
     */
    static getAllRegion(req: Request, res: Response): Promise<void>;
    /**
     * Retrieves a region by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the region.
     */
    static getRegionById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * Creates a new region and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the region.
     */
    static createRegion(req: Request, res: Response): Promise<void>;
    /**
     * Deletes a region by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the region.
     */
    static removeRegion(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=region.controller.d.ts.map