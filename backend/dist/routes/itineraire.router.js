import { Router } from "express";
import { ItineraireController } from "../controllers/itineraire.controller.js";
const ItineraireRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Itineraires
 *   description: Gestion des itinéraires de bus
 */
/**
 * @swagger
 * /itineraires:
 *   get:
 *     summary: Récupérer la liste de tous les itinéraires
 *     tags: [Itineraires]
 *     responses:
 *       200:
 *         description: Liste des itinéraires récupérée avec succès
 */
ItineraireRouter.get("/", ItineraireController.FindAllItineraire);
/**
 * @swagger
 * /itineraires/{id}:
 *   get:
 *     summary: Récupérer un itinéraire par ID
 *     tags: [Itineraires]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'itinéraire
 *     responses:
 *       200:
 *         description: Itinéraire trouvé
 *       404:
 *         description: Itinéraire non trouvé
 */
ItineraireRouter.get("/:id", ItineraireController.FindItineraireById);
/**
 * @swagger
 * /itineraires/create:
 *   post:
 *     summary: Créer un nouvel itinéraire
 *     tags: [Itineraires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               depart:
 *                 type: string
 *                 example: "Anosy"
 *               destination:
 *                 type: string
 *                 example: "Andoharanofotsy"
 *               distance:
 *                 type: number
 *                 example: 12.5
 *               duree:
 *                 type: number
 *                 example: 30
 *               tarif:
 *                 type: number
 *                 example: 1200
 *               ligneId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Itinéraire créé avec succès
 */
ItineraireRouter.post("/create", ItineraireController.CreateItineraire);
/**
 * @swagger
 * /itineraires/update/{id}:
 *   put:
 *     summary: Mettre à jour un itinéraire existant
 *     tags: [Itineraires]
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
 *               depart:
 *                 type: string
 *                 example: "Analakely"
 *               destination:
 *                 type: string
 *                 example: "Ambohibao"
 *               distance:
 *                 type: number
 *                 example: 15
 *               duree:
 *                 type: number
 *                 example: 40
 *               tarif:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Itinéraire mis à jour avec succès
 *       404:
 *         description: Itinéraire non trouvé
 */
ItineraireRouter.put("/update/:id", ItineraireController.UpdateItineraire);
/**
 * @swagger
 * /itineraires/remove/{id}:
 *   delete:
 *     summary: Supprimer un itinéraire
 *     tags: [Itineraires]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Itinéraire supprimé avec succès
 *       404:
 *         description: Itinéraire non trouvé
 */
ItineraireRouter.delete("/remove/:id", ItineraireController.RemoveItineraire);
export default ItineraireRouter;
//# sourceMappingURL=itineraire.router.js.map