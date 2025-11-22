"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const notificationService = new notification_service_1.NotificationService();
class NotificationController {
    static async findAllNotification(req, res) {
        try {
            const result = await notificationService.findAllNotif();
            res.status(200).json(result);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erreur lors de la récupération des lignes"
            });
        }
    }
    static async removeNotification(req, res) {
        try {
            const id = Number(req.params.id);
            await notificationService.removeNotification(id);
            res.status(200).json({ message: "notification supprimer avec success" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression de la notification" });
        }
    }
    static async markRead(req, res) {
        try {
            const id = Number(req.params.id);
            await notificationService.markAsRead(id);
            res.status(200).json({ success: true });
        }
        catch (e) {
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map