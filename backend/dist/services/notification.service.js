"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const data_source_1 = require("../config/data-source");
const notification_1 = require("../entities/notification");
const server_1 = require("../server");
class NotificationService {
    constructor() {
        this.notificationRepo = data_source_1.AppDataSource.getRepository(notification_1.NotificationEntity);
        this.geteway = server_1.notificationGateway;
    }
    /**
     * Envoi une notification à tous les utilisateurs.
     * @param {string} title Le titre de la notification.
     * @param {string} message Le message de la notification.
     * @param {string} type Le type de la notification (info, success, error, ou warning).
     * @returns {Promise<void>} Une promesse qui se r solve lorsque la notification a été envoyée.
     */
    async notifyAll(title, message, type = 'info') {
        this.geteway.emitNotifRegisterToAdmin({
            title,
            message,
            type,
            date: new Date().toISOString(),
        });
    }
    /**
     * Send a notification to all users.
     * @param {string} title The title of the notification.
     * @param {string} message The message of the notification.
     * @param {string} type The type of the notification (info, success, error, or warning).
     * @returns {Promise<void>} A promise that resolves when the notification has been sent.
     */
    async notifAll__(title, message, type = 'info') {
        const notif = this.notificationRepo.create({
            title,
            message,
            type,
        });
        const saveNotif = await this.notificationRepo.save(notif);
        this.geteway.emitNotifRegisterToAdmin({
            title: saveNotif.title,
            message: saveNotif.message,
            type: saveNotif.type,
            date: saveNotif.date.toISOString(),
        });
    }
    /**
     * Retrieves all notifications in descending order of their creation date.
     *
     * @returns {Promise<NotificationEntity[]>} A promise that resolves to an array of NotificationEntity objects.
     */
    async findAllNotif() {
        const response = this.notificationRepo.find({
            order: { date: 'DESC' },
        });
        return response;
    }
    /**
     * Deletes a notification by its ID.
     *
     * @throws {Error} If the notification is not found or if an error occurs while deleting the notification.
     *
     * @param {number} id The ID of the notification to delete.
     * @returns {Promise<void>} A promise that resolves when the notification has been deleted.
     */
    async removeNotification(id) {
        try {
            const notif = await this.notificationRepo.findOneBy({ id });
            if (!notif) {
                throw new Error(`Notification #${id} introuvable`);
            }
            const result = await this.notificationRepo.delete({ id });
            return result;
        }
        catch (error) {
            console.error(`Erreur lors de la suppression de la notif ${id}:`, error);
            throw error;
        }
    }
    /**
     * Marks a notification as read.
     *
     * @param {number} id The ID of the notification to mark as read.
     * @returns {Promise<void>} A promise that resolves when the notification has been marked as read.
     */
    async markAsRead(id) {
        return await this.notificationRepo.update({ id }, { isRead: true });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map