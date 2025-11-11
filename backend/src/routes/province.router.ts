import { Router } from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { ProvinceController } from "../controllers/province.controller.js";

const ProvinceRouter = Router();

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
ProvinceRouter.get("/", ProvinceController.getAllProvinces);

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
ProvinceRouter.get("/:id", ProvinceController.getProvinceById);

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
ProvinceRouter.post("/create",authenticate,authorize("admin"),ProvinceController.createProvince);



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
ProvinceRouter.delete("/remove/:id",authenticate,authorize("admin"), ProvinceController.removeProvince);

export default ProvinceRouter;
