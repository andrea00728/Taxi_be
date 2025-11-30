import { NotificationEntity } from "../entities/notification";
export declare class NotificationService {
    private notificationRepo;
    private geteway;
    /**
     * Envoi une notification à tous les utilisateurs.
     * @param {string} title Le titre de la notification.
     * @param {string} message Le message de la notification.
     * @param {string} type Le type de la notification (info, success, error, ou warning).
     * @returns {Promise<void>} Une promesse qui se r solve lorsque la notification a été envoyée.
     */
    notifyAll(title: string, message: string, type?: 'info' | 'success' | 'error' | 'warning'): Promise<void>;
    /**
     * Send a notification to all users.
     * @param {string} title The title of the notification.
     * @param {string} message The message of the notification.
     * @param {string} type The type of the notification (info, success, error, or warning).
     * @returns {Promise<void>} A promise that resolves when the notification has been sent.
     */
    notifAll__(title: string, message: string, type?: 'info' | 'success' | 'error' | 'warning'): Promise<void>;
    /**
     * Retrieves all notifications in descending order of their creation date.
     *
     * @returns {Promise<NotificationEntity[]>} A promise that resolves to an array of NotificationEntity objects.
     */
    findAllNotif(): Promise<NotificationEntity[]>;
    /**
     * Deletes a notification by its ID.
     *
     * @throws {Error} If the notification is not found or if an error occurs while deleting the notification.
     *
     * @param {number} id The ID of the notification to delete.
     * @returns {Promise<void>} A promise that resolves when the notification has been deleted.
     */
    removeNotification(id: number): Promise<import("typeorm").DeleteResult>;
    /**
     * Marks a notification as read.
     *
     * @param {number} id The ID of the notification to mark as read.
     * @returns {Promise<void>} A promise that resolves when the notification has been marked as read.
     */
    markAsRead(id: number): Promise<import("typeorm").UpdateResult>;
}
//# sourceMappingURL=notification.service.d.ts.map