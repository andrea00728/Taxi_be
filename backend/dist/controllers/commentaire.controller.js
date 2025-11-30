"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentaireController = void 0;
const commentaire_service_1 = require("../services/commentaire.service");
const comsService = new commentaire_service_1.CommentaireService();
class CommentaireController {
    static async getAll_Coms(req, res) {
        try {
            const data = await comsService.getAllComs();
            res.status(200).json(data);
        }
        catch (error) {
            console.log("Erreur lors de la recuperation des commentaire", error);
            res.status(500).json({ message: "Erreur lors de la recuperation des commentaire" });
            throw new Error("Erreur lors de la recuperation des commentaire");
        }
    }
    static async getAll_comsBy_Ligne(req, res) {
        try {
            const ligne_id = Number(req.params.id);
            const data = await comsService.getComsByLigne(ligne_id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(`erreur lors de la recuperation deu commentaire  `, error);
            res.status(500).json({ message: `erreur lors de la recuperation du commentaire ` });
            throw new Error(`erreur lors de la recuperation deu commentaire  `);
        }
    }
    static async create_Coms(req, res) {
        try {
            const payload = req.body;
            const firebaseUid = req.user.uid;
            const create_coms = await comsService.createCommentaire(payload, firebaseUid);
            res.status(201).json(create_coms);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur lors de la creation du commentaire" });
            throw new Error("Erreur lors de la creation du commentaire");
        }
    }
    static async deleteCOoms(req, res) {
        try {
            const id = Number(req.params.id);
            const userUid = req.user.uid;
            const userRole = req.user.role;
            await comsService.removeComs(id, userUid, userRole);
            res.status(200).json({ message: "Commentaire supprimé avec succès" });
        }
        catch (error) {
            console.error("Erreur suppression:", error);
            if (error.message === 'Vous n\'êtes pas autorisé à supprimer ce commentaire') {
                res.status(403).json({ message: error.message });
            }
            else if (error.message.includes('introuvable')) {
                res.status(404).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Erreur lors de la suppression du commentaire" });
            }
        }
    }
}
exports.CommentaireController = CommentaireController;
//# sourceMappingURL=commentaire.controller.js.map