"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const region_controller_js_1 = require("../controllers/region.controller.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const RegionRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Regions
 *   description: Gestion des regions
 */
/**
 * @swagger
 * /regions:
 *   get:
 *     summary: Récupérer la liste de toutes les regions
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: Liste des regions récupérée avec succès
 */
RegionRouter.get("/", region_controller_js_1.RegionController.getAllRegion);
/**
 * @swagger
 * /regions/{id}:
 *   get:
 *     summary: Récupérer une region par ID
 *     tags: [Regions]
 *     responses:
 *       200:
 *         description: Region récupérée avec succès
 */
RegionRouter.get("/:id", region_controller_js_1.RegionController.getRegionById);
/**
 * @swagger
 * /regions/create:
 *   post:
 *     summary: Créer un nouveau Region
 *     tags: [Regions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Antananarivo
 *               province_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Region enregistrée avec succès
 */
RegionRouter.post("/create", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), region_controller_js_1.RegionController.createRegion);
/**
 * @swagger
 * /arrets/remove/{id}:
 *   delete:
 *     summary: Supprimer un region (Admin seulement)
 *     tags: [Regions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Region supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé (réservé aux administrateurs)
 *       404:
 *         description: Region non trouvé
 */
RegionRouter.delete("/remove/:id", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), region_controller_js_1.RegionController.removeRegion);
exports.default = RegionRouter;
//# sourceMappingURL=region.route.js.map