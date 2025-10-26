import { Router } from "express";
import { ArretController } from "../controllers/arret.controller.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const ArretRouter = Router();
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
ArretRouter.get("/", ArretController.getAllArret);
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
ArretRouter.get("/:id", ArretController.getArretById);
ArretRouter.delete("/:id", verifyToken(["admin"]), ArretController.RemoveArret);
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
 *               ligneId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Arrêt créé avec succès
 */
ArretRouter.post("/create", verifyToken(["admin"]), ArretController.createArret);
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
ArretRouter.put("/update/:id", verifyToken(["admin"]), ArretController.updateArret);
// /**
//  * @swagger
//  * /arrets/remove/{id}:
//  *   delete:
//  *     summary: Supprimer un arrêt (Admin seulement)
//  *     tags: [Arrets]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Arrêt supprimé avec succès
//  */
// ArretRouter.delete("/remove/:id", verifyToken(["admin"]), ArretController.RemoveArret);
export default ArretRouter;
//# sourceMappingURL=arret.router.js.map