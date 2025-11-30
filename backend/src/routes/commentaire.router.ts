import { Router } from "express";
import { CommentaireController } from "../controllers/commentaire.controller";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const comsRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Commentaires
 *   description: Gestion des commentaires
 */

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
comsRoute.get("/", CommentaireController.getAll_Coms);

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
comsRoute.get("/:id", CommentaireController.getAll_comsBy_Ligne); // ✅ Correction route

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
comsRoute.post("/create", authenticate, authorize("admin","user"), CommentaireController.create_Coms);




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
comsRoute.delete("/remove/:id", authenticate, authorize("admin","user"), CommentaireController.deleteCOoms);

export default comsRoute;
