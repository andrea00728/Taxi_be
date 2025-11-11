"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const arret_controller_js_1 = require("../controllers/arret.controller.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const ArretRouter = (0, express_1.Router)();
ArretRouter.get("/search", arret_controller_js_1.ArretController.search);
/**
 * @swagger
 * tags:
 *   name: Arrets
 *   description: Gestion des arrêts de bus
 */
/**
 * @swagger
 * /arrets:
 *   get:
 *     summary: Récupérer la liste de tous les arrêts
 *     tags: [Arrets]
 *     responses:
 *       200:
 *         description: Liste des arrêts récupérée avec succès
 */
ArretRouter.get("/", arret_controller_js_1.ArretController.getAllArret);
/**
 * @swagger
 * /arrets/me:
 *   get:
 *     summary: Récupérer la liste de tous les arrêts
 *     tags: [Arrets]
 *     responses:
 *       200:
 *         description: Liste des arrêts récupérée avec succès
 */
ArretRouter.get("/me", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("user", "admin"), arret_controller_js_1.ArretController.getArretByUser);
/**
 * @swagger
 * /arrets/{id}:
 *   get:
 *     summary: Récupérer un arrêt par ID
 *     tags: [Arrets]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'arrêt
 *     responses:
 *       200:
 *         description: Détails de l'arrêt
 *       404:
 *         description: Arrêt non trouvé
 *   delete:
 *     summary: Supprimer un arrêt (Admin seulement)
 *     tags: [Arrets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'arrêt à supprimer
 *     responses:
 *       200:
 *         description: Arrêt supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé (réservé aux administrateurs)
 *       404:
 *         description: Arrêt non trouvé
 */
ArretRouter.get("/:id", arret_controller_js_1.ArretController.getArretById);
ArretRouter.delete("/:id", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin", "user"), arret_controller_js_1.ArretController.RemoveArret);
/**
 * @swagger
 * /arrets/create:
 *   post:
 *     summary: Créer un nouvel arrêt
 *     tags: [Arrets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Arrêt Analakely
 *               latitude:
 *                 type: number
 *                 example: -18.91368
 *               longitude:
 *                 type: number
 *                 example: 47.52875
 *               nomligne:
 *                 type: string
 *                 example: Ligne 101
 *     responses:
 *       201:
 *         description: Arrêt créé avec succès
 */
ArretRouter.post("/create", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin", "user"), arret_controller_js_1.ArretController.createArret);
/**
 * @swagger
 * /arrets/update/{id}:
 *   put:
 *     summary: Mettre à jour un arrêt existant
 *     tags: [Arrets]
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
 *                 example: Arrêt Ambanidia
 *               latitude:
 *                 type: number
 *                 example: -18.9121
 *               longitude:
 *                 type: number
 *                 example: 47.5269
 *     responses:
 *       200:
 *         description: Arrêt mis à jour avec succès
 *       404:
 *         description: Arrêt non trouvé
 */
ArretRouter.put("/update/:id", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), arret_controller_js_1.ArretController.updateArret);
exports.default = ArretRouter;
//# sourceMappingURL=arret.router.js.map