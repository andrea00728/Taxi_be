import { Router } from "express";
import { TrajetController } from "../controllers/trajet.controller.js";

const TrajetRouter = Router();

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
TrajetRouter.get("/search", TrajetController.search);

export default TrajetRouter;
