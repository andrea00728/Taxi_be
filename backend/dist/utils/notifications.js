"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedAdminsCount = exports.getConnectedUsersCount = exports.broadcastNotification = exports.sendNotificationToAllAdmins = exports.sendNotificationToUser = void 0;
const server_js_1 = require("../server.js");
/**
 * Envoie une notification à un utilisateur spécifique
 */
const sendNotificationToUser = (firebaseUid, notification) => {
    console.log("🔍 ConnectedUsers actuel:", Array.from(server_js_1.connectedUsers.entries()));
    const user = server_js_1.connectedUsers.get(firebaseUid);
    if (user) {
        console.log(`📤 Émission vers socketId: ${user.socketId}`);
        server_js_1.io.to(user.socketId).emit('notification', notification);
        console.log(`✅ Notification envoyée à ${firebaseUid}`);
        return true;
    }
    console.log(`❌ User ${firebaseUid} NON TROUVÉ dans connectedUsers`);
    console.log(`   → UID cherché: "${firebaseUid}"`);
    console.log(`   → UIDs disponibles:`, Array.from(server_js_1.connectedUsers.keys()));
    return false;
};
exports.sendNotificationToUser = sendNotificationToUser;
/**
 * Envoie une notification à tous les admins connectés
 */
const sendNotificationToAllAdmins = (notification) => {
    let count = 0;
    for (const [uid, user] of server_js_1.connectedUsers.entries()) {
        if (user.role === 'admin') {
            server_js_1.io.to(user.socketId).emit('notification', notification);
            count++;
        }
    }
    console.log(`📬 Notification envoyée à ${count} admin(s)`);
    return count;
};
exports.sendNotificationToAllAdmins = sendNotificationToAllAdmins;
/**
 * Broadcast à tous les utilisateurs connectés
 */
const broadcastNotification = (notification) => {
    server_js_1.io.emit('notification', notification);
    console.log(`📢 Notification diffusée à tous les utilisateurs connectés`);
};
exports.broadcastNotification = broadcastNotification;
/**
 * Obtenir le nombre d'utilisateurs connectés
 */
const getConnectedUsersCount = () => {
    return server_js_1.connectedUsers.size;
};
exports.getConnectedUsersCount = getConnectedUsersCount;
/**
 * Obtenir le nombre d'admins connectés
 */
const getConnectedAdminsCount = () => {
    let count = 0;
    for (const [uid, user] of server_js_1.connectedUsers.entries()) {
        if (user.role === 'admin')
            count++;
    }
    return count;
};
exports.getConnectedAdminsCount = getConnectedAdminsCount;
//# sourceMappingURL=notifications.js.map