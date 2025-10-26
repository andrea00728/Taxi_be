import { DistrictService } from "../services/districts.service.js";
const districtService = new DistrictService();
export class DistrictController {
    /**
     * Retrieves all districts from the database, including their associated lignes and arrets.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the districts.
     */
    static async getAllDistrict(req, res) {
        try {
            const data = await districtService.getAllDistricts();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des districts" });
        }
    }
    /**
     * Retrieves a district by its ID, including its associated lignes and arrets.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the district.
     */
    static async getDistrictById(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await districtService.getDistrictById(id);
            if (!data) {
                res.status(404).json({ message: "District introuvable" });
            }
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du district" });
        }
    }
    /**
     * Creates a new district and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the district.
     */
    static async createDistrict(req, res) {
        try {
            const payload = req.body;
            const createDistrict = await districtService.createDistrict(payload);
            res.status(201).json({ message: "district crée avec succès", createDistrict });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la création du district" });
        }
    }
    /**
     * Deletes a district by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the district.
     */
    static async removeDistrict(req, res) {
        try {
            const id = Number(req.params.id);
            await districtService.removeDistrict(id);
            res.status(200).json({ message: "district supprimée avec succès" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression du district" });
        }
    }
}
//# sourceMappingURL=district.controller.js.map