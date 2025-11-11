import { Router } from "express";
import { RegionController } from "../controllers/region.controller.js";
import { authenticate, authorize} from "../middlewares/authMiddleware.js";

const RegionRouter =Router();



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
RegionRouter.get("/",RegionController.getAllRegion);

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
RegionRouter.get("/:id",RegionController.getRegionById);


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

RegionRouter.post("/create",authenticate,authorize("admin"),RegionController.createRegion);


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
RegionRouter.delete("/remove/:id",authenticate,authorize("admin"),RegionController.removeRegion);


export default RegionRouter;