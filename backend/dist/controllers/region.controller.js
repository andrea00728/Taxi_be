"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionController = void 0;
const region_sevice_js_1 = require("../services/region.sevice.js");
const regionService = new region_sevice_js_1.RegionService();
class RegionController {
    /**
     * Retrieves all regions from the database.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the regions.
     */
    static async getAllRegion(req, res) {
        try {
            const data = await regionService.getAllRegion();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des regions" });
        }
    }
    /**
     * Retrieves a region by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the region.
     */
    static async getRegionById(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await regionService.getRegionById(id);
            if (!data) {
                return res.status(404).json({ message: "region introuvable" });
            }
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de la region" });
        }
    }
    /**
     * Creates a new region and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the region.
     */
    static async createRegion(req, res) {
        try {
            const payload = req.body;
            const createRegion = await regionService.createRegion(payload);
            res.status(201).json({ message: "region crée avec succès", createRegion });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de la region" });
        }
    }
    /**
     * Deletes a region by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the region.
     */
    static async removeRegion(req, res) {
        try {
            const id = Number(req.params.id);
            await regionService.removeRegion(id);
            res.status(200).json({ message: "region supprimée avec succès" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la region" });
        }
    }
}
exports.RegionController = RegionController;
//# sourceMappingURL=region.controller.js.map