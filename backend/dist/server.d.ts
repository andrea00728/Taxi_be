import { Server } from 'socket.io';
import '@dotenvx/dotenvx/config';
import { NotificationGateway } from './gateway/notification.gateway';
export declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const notificationGateway: NotificationGateway;
export declare const connectedUsers: Map<string, {
    socketId: string;
    firebaseUid: string;
    role: string;
}>;
//# sourceMappingURL=server.d.ts.map