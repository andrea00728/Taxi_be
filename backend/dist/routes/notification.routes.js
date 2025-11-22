"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const NotificationRouter = (0, express_1.Router)();
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
NotificationRouter.get("/", notification_controller_1.NotificationController.findAllNotification);
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
NotificationRouter.delete("/remove/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin", "user"), notification_controller_1.NotificationController.removeNotification);
NotificationRouter.put("/read/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin", "user"), notification_controller_1.NotificationController.markRead);
exports.default = NotificationRouter;
//# sourceMappingURL=notification.routes.js.map