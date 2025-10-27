"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItineraireController = void 0;
const itineraire_service_js_1 = require("../services/itineraire.service.js");
const itinerairesService = new itineraire_service_js_1.ItineraireService();
class ItineraireController {
    /**
     * Retrieves all itineraires from the database.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the itineraires.
     */
    static async FindAllItineraire(req, res) {
        try {
            const data = await itinerairesService.getAllItineraire();
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la recuperation des itineraire" });
        }
    }
    /**
     * Retrieves an itineraire by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the itineraire.
     */
    static async FindItineraireById(req, res) {
        try {
            const id = Number(req.params.id);
            const data = await itinerairesService.getItinById(id);
            if (!data) {
                res.status(404).json({ message: "Itineraire Introuvable" });
            }
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la recuperation de l'Itineraire " });
        }
    }
    /**
     * Creates a new itineraire and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the itineraire.
     */
    static async CreateItineraire(req, res) {
        try {
            const payload = req.body;
            const createIt = await itinerairesService.createItineraires(payload);
            res.status(201).json({ message: "Itineraire enregistrer avec succee", createIt });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de l'enregistrement d'ítineraire " });
        }
    }
    /**
     * Updates an itineraire by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while updating the itineraire.
     */
    static async UpdateItineraire(req, res) {
        try {
            const id = Number(req.params.id);
            const updateIt = await itinerairesService.updateItin(id, req.body);
            res.status(200).json({ message: "itineraire mis a jour avec succes", updateIt });
        }
        catch (error) {
            res.status(500).json({ message: "erreur lors de la mis a jour d'itineraire" });
        }
    }
    /**
     * Deletes an itineraire by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the itineraire.
     */
    static async RemoveItineraire(req, res) {
        try {
            const id = Number(req.params.id);
            await itinerairesService.deleteItin(id);
            res.status(200).json({ message: "Itineraire supprimer avec succes" });
        }
        catch (error) {
            res.status(500).json({ message: "erreur lors de la suppression" });
        }
    }
}
exports.ItineraireController = ItineraireController;
//# sourceMappingURL=itineraire.controller.js.map