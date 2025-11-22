import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const NotificationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: notification
 *   description: gestion des notification
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Récupérer toutes les notification
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Liste des Notification
 */
NotificationRouter.get("/", NotificationController.findAllNotification);



/**
 * @swagger
 * /notifications/remove/{id}:
 *   delete:
 *     summary: Supprimer une ligne
 *     tags: [Notificatios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: notification supprimée avec succès
 *       404:
 *         description: Notification pas trouves  non trouvée
 */
NotificationRouter.delete("/remove/:id", authenticate, authorize("admin","user"),NotificationController.removeNotification);



NotificationRouter.put("/read/:id", authenticate, authorize("admin","user"), NotificationController.markRead);

export default  NotificationRouter;
