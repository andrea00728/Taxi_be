"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvinceController = void 0;
const province_service_js_1 = require("../services/province.service.js");
const pronvinceService = new province_service_js_1.ProvinceService();
class ProvinceController {
    /**
     * Retrieves all provinces from the database, including their associated regions, districts and lignes.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the provinces.
     */
    static async getAllProvinces(req, res) {
        try {
            const data = await pronvinceService.getAllProvinces();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des provinces" });
        }
    }
    /**
     * Retrieves a province by its ID, including its associated regions, districts and lignes.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the province.
     */
    static async getProvinceById(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await pronvinceService.getProvinceById(id);
            if (!data) {
                res.status(404).json({ message: "Province introuvable" });
            }
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération de la province" });
        }
    }
    /**
     * Creates a new province and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the province.
     */
    static async createProvince(req, res) {
        try {
            const payload = req.body;
            const createprovince = await pronvinceService.createProvince(payload);
            res.status(201).json({ message: "province crée avec succès", createprovince });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la création de la province" });
        }
    }
    /**
     * Deletes a province by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the province.
     */
    static async removeProvince(req, res) {
        try {
            const id = Number(req.params.id);
            await pronvinceService.removeProvince(id);
            res.status(200).json({ message: "province supprimée avec succès" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la province" });
        }
    }
}
exports.ProvinceController = ProvinceController;
//# sourceMappingURL=province.controller.js.map