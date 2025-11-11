"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictRoute = void 0;
const express_1 = require("express");
const district_controller_js_1 = require("../controllers/district.controller.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const DistrictRoute = (0, express_1.Router)();
exports.DistrictRoute = DistrictRoute;
/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: Gestion des districts
 */
/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Récupérer la liste de tous les districts
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: Liste des districts récupérée avec succès
 */
DistrictRoute.get("/", district_controller_js_1.DistrictController.getAllDistrict);
/**
 * @swagger
 * /districts/{id}:
 *   get:
 *     summary: Récupérer un district par ID
 *     tags: [Districts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: District récupérée avec succès
 */
DistrictRoute.get("/:id", district_controller_js_1.DistrictController.getDistrictById);
/**
 * @swagger
 * /districts/create:
 *   post:
 *     summary: Créer un nouvel District
 *     tags: [Districts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Anosy
 *               region_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: District enregistré avec succès
 */
DistrictRoute.post("/create", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), district_controller_js_1.DistrictController.createDistrict);
/**
 * @swagger
 * /districts/remove/{id}:
 *   delete:
 *     summary: Supprimer un district (Admin seulement)
 *     tags: [Districts]
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
 *         description: Districts supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé (réservé aux administrateurs)
 *       404:
 *         description: Districts non trouvé
 */
DistrictRoute.delete("/remove/:id", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), district_controller_js_1.DistrictController.removeDistrict);
//# sourceMappingURL=district.route.js.map