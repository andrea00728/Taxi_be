"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentaire_controller_1 = require("../controllers/commentaire.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const comsRoute = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Commentaires
 *   description: Gestion des commentaires
 */
/**
 * @swagger
 * /commentaires/recent/{id}:
 *   get:
 *     summary: Récupere le commentaire plus recente
 *     tags: [Commentaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ligne
 *     responses:
 *       200:
 *         description: Commentaires récupérés avec succès
 */
comsRoute.get("/recent/:id", commentaire_controller_1.CommentaireController.getComsRecent);
/**
 * @swagger
 * /commentaires:
 *   get:
 *     summary: Récupérer tous les commentaires
 *     tags: [Commentaires]
 *     responses:
 *       200:
 *         description: Liste des commentaires récupérée avec succès
 */
comsRoute.get("/", commentaire_controller_1.CommentaireController.getAll_Coms);
/**
 * @swagger
 * /commentaires/{id}:
 *   get:
 *     summary: Récupérer tous les commentaires d'une ligne
 *     tags: [Commentaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ligne
 *     responses:
 *       200:
 *         description: Commentaires récupérés avec succès
 */
comsRoute.get("/:id", commentaire_controller_1.CommentaireController.getAll_comsBy_Ligne);
/**
 * @swagger
 * /commentaires/create:
 *   post:
 *     summary: Créer un nouveau commentaire
 *     tags: [Commentaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *               - ligne_id
 *             properties:
 *               contenu:
 *                 type: string
 *                 example: Très bon service !
 *               satisfaction:
 *                 type: string
 *                 enum: [decevant, moyen, excellent]
 *                 example: excellent
 *               ligne_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 */
comsRoute.post("/create", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin", "user"), commentaire_controller_1.CommentaireController.create_Coms);
/**
 * @swagger
 * /commentaires/remove/{id}:
 *   delete:
 *     summary: Supprimer une commentaire
 *     tags: [commentaires]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: commentaire supprimée avec succès
 *       404:
 *         description: commentaires non trouvée
 */
comsRoute.delete("/remove/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin", "user"), commentaire_controller_1.CommentaireController.deleteCOoms);
exports.default = comsRoute;
//# sourceMappingURL=commentaire.router.js.map