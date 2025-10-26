import { Router } from "express";
import { DistrictController } from "../controllers/district.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const DistrictRoute = Router();
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
DistrictRoute.get("/", DistrictController.getAllDistrict);
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
DistrictRoute.get("/:id", DistrictController.getDistrictById);
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
DistrictRoute.post("/create", DistrictController.createDistrict);
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
DistrictRoute.delete("/remove/:id", verifyToken(["admin"]), DistrictController.removeDistrict);
export { DistrictRoute };
//# sourceMappingURL=district.route.js.map