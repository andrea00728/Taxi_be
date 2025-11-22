"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
class NotificationGateway {
    constructor(socketServer) {
        this.server = socketServer;
        this.setupConnection();
    }
    setupConnection() {
        this.server.on('connection', (socket) => {
            console.log('Client connecté:', socket.id);
            socket.on('disconnect', () => {
                console.log('Client déconnecté:', socket.id);
            });
        });
    }
    emitNotification(notification) {
        console.log('Envoi notification:', notification);
        this.server.emit('notification', notification);
    }
    emitNotifRegisterToAdmin(notifRegister) {
        console.log('Envoi notifRegister:', notifRegister);
        this.server.emit('notifRegister', notifRegister);
    }
    emitNotificationMessage(payload) {
        console.log('Envoi notification message:', payload);
        this.server.emit('notificationMessageAdmin', payload);
    }
}
exports.NotificationGateway = NotificationGateway;
//# sourceMappingURL=notification.gateway.js.map