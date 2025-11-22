import { Server } from 'socket.io';
interface Notification {
    id?: number;
    title: string;
    message: string;
    type?: string;
    date?: string;
}
export declare class NotificationGateway {
    private server;
    constructor(socketServer: Server);
    private setupConnection;
    emitNotification(notification: Notification): void;
    emitNotifRegisterToAdmin(notifRegister: Notification): void;
    emitNotificationMessage(payload: any): void;
}
export {};
//# sourceMappingURL=notification.gateway.d.ts.map