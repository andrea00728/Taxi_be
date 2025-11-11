"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const province_controller_js_1 = require("../controllers/province.controller.js");
const ProvinceRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: Gestion des Provinces
 */
/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Récupérer la liste de tous les les province
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Liste de tout les provinces récupérée avec succès
 */
ProvinceRouter.get("/", province_controller_js_1.ProvinceController.getAllProvinces);
/**
 * @swagger
 * /provinces/{id}:
 *   get:
 *     summary: Récupérer un province par ID
 *     tags: [Provinces]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du province
 *     responses:
 *       200:
 *         description: Détails de l'arrêt
 *       404:
 *         description: Arrêt non trouvé
 */
ProvinceRouter.get("/:id", province_controller_js_1.ProvinceController.getProvinceById);
/**
 * @swagger
 * /provinces/create:
 *   post:
 *     summary: Créer un nouveau Region
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Fianarantsoa
 *     responses:
 *       201:
 *         description: Province enregistrée avec succès
 */
ProvinceRouter.post("/create", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), province_controller_js_1.ProvinceController.createProvince);
/**
 * @swagger
 * /provinces/remove/{id}:
 *   delete:
 *     summary: Supprimer un arrêt (Admin seulement)
 *     tags: [Provinces]
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
 *         description: Arrêt supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Accès refusé (réservé aux administrateurs)
 *       404:
 *         description: Arrêt non trouvé
 */
ProvinceRouter.delete("/remove/:id", authMiddleware_js_1.authenticate, (0, authMiddleware_js_1.authorize)("admin"), province_controller_js_1.ProvinceController.removeProvince);
exports.default = ProvinceRouter;
//# sourceMappingURL=province.router.js.map