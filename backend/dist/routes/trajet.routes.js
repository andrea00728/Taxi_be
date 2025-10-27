"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trajet_controller_js_1 = require("../controllers/trajet.controller.js");
const TrajetRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Trajets
 *   description: Recherche des trajets disponibles
 */
/**
 * @swagger
 * /Trajet/search:
 *   get:
 *     summary: Rechercher des trajets selon départ et destination
 *     tags: [Trajets]
 *     parameters:
 *       - name: depart
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Point de départ
 *       - name: destination
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination finale
 *     responses:
 *       200:
 *         description: Liste des trajets trouvés
 *       404:
 *         description: Aucun trajet trouvé
 */
TrajetRouter.get("/search", trajet_controller_js_1.TrajetController.search);
exports.default = TrajetRouter;
//# sourceMappingURL=trajet.routes.js.map