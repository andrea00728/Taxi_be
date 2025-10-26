import { Router } from "express";
import { LigneController } from "../controllers/ligne.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const ligneRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Lignes
 *   description: Gestion des lignes de bus
 */

/**
 * @swagger
 * /lignes:
 *   get:
 *     summary: Récupérer toutes les lignes de bus
 *     tags: [Lignes]
 *     responses:
 *       200:
 *         description: Liste des lignes récupérée avec succès
 */
ligneRouter.get("/", LigneController.getAllLignes);

/**
 * @swagger
 * /lignes/{id}:
 *   get:
 *     summary: Récupérer une ligne par ID
 *     tags: [Lignes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ligne
 *     responses:
 *       200:
 *         description: Ligne trouvée
 *       404:
 *         description: Ligne non trouvée
 */
ligneRouter.get("/:id", LigneController.getLigneById);

/**
 * @swagger
 * /lignes/create:
 *   post:
 *     summary: Créer une nouvelle ligne
 *     tags: [Lignes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Ligne 101
 *               tarif:
 *                 type: number
 *                 example: 600
 *               depart:
 *                 type: string
 *                 example: Analakely
 *               terminus:
 *                 type: string
 *                 example: Ambohijatovo
 *               district_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Ligne créée avec succès
 */
ligneRouter.post("/create",verifyToken(["admin"]), LigneController.createLigne);

/**
 * @swagger
 * /lignes/update/{id}:
 *   put:
 *     summary: Mettre à jour une ligne existante
 *     tags: [Lignes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Ligne 101 modifiée
 *     responses:
 *       200:
 *         description: Ligne mise à jour avec succès
 *       404:
 *         description: Ligne non trouvée
 */
ligneRouter.put("/update/:id",verifyToken(["admin"]), LigneController.updateLigne);

/**
 * @swagger
 * /lignes/remove/{id}:
 *   delete:
 *     summary: Supprimer une ligne
 *     tags: [Lignes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ligne supprimée avec succès
 *       404:
 *         description: Ligne non trouvée
 */
ligneRouter.delete("/remove/:id",verifyToken(["admin"]), LigneController.deleteLigne);

export default ligneRouter;
