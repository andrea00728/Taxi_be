import { NotificationEntity } from "../entities/notification";
export declare class NotificationService {
    private notificationRepo;
    private geteway;
    notifyAll(title: string, message: string, type?: 'info' | 'success' | 'error' | 'warning'): Promise<void>;
    notifAll__(title: string, message: string, type?: 'info' | 'success' | 'error' | 'warning'): Promise<void>;
    findAllNotif(): Promise<NotificationEntity[]>;
    removeNotification(id: number): Promise<import("typeorm").DeleteResult>;
    markAsRead(id: number): Promise<import("typeorm").UpdateResult>;
}
//# sourceMappingURL=notification.service.d.ts.map