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
    async notifyAll(title, message, type = 'info') {
        this.geteway.emitNotifRegisterToAdmin({
            title,
            message,
            type,
            date: new Date().toISOString(),
        });
    }
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
    async findAllNotif() {
        const response = this.notificationRepo.find({
            order: { date: 'DESC' },
        });
        return response;
    }
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
    async markAsRead(id) {
        return await this.notificationRepo.update({ id }, { isRead: true });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map