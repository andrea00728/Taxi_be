"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ligne_controller_js_1 = require("../controllers/ligne.controller.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const ligneRouter = (0, express_1.Router)();
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
ligneRouter.get("/", ligne_controller_js_1.LigneController.getAllLignes);
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
ligneRouter.get("/:id", ligne_controller_js_1.LigneController.getLigneById);
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
ligneRouter.post("/create", (0, authMiddleware_js_1.verifyToken)(["admin"]), ligne_controller_js_1.LigneController.createLigne);
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
ligneRouter.put("/update/:id", (0, authMiddleware_js_1.verifyToken)(["admin"]), ligne_controller_js_1.LigneController.updateLigne);
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
ligneRouter.delete("/remove/:id", (0, authMiddleware_js_1.verifyToken)(["admin"]), ligne_controller_js_1.LigneController.deleteLigne);
exports.default = ligneRouter;
//# sourceMappingURL=ligne.routes.js.map