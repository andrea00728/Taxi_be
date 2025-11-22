"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedUsers = exports.notificationGateway = exports.io = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_js_1 = __importDefault(require("./app.js"));
require("@dotenvx/dotenvx/config");
// IMPORT IMPORTANT : Importe la classe (pas l'instance)
const notification_gateway_1 = require("./gateway/notification.gateway"); // Ajuste le chemin si besoin
const httpServer = (0, http_1.createServer)(app_js_1.default);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: [
            "http://localhost:8081",
            "exp://192.168.1.189:8081",
            "http://localhost:19006",
            "http://localhost:19000",
            "http://192.168.1.189:19000",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});
// Crée l'instance unique de la Gateway ici
exports.notificationGateway = new notification_gateway_1.NotificationGateway(exports.io);
exports.connectedUsers = new Map();
// Bloc WebSocket principal
exports.io.on('connection', (socket) => {
    // Enregistrement d’un utilisateur côté WebSocket
    socket.on('register', (data) => {
        exports.connectedUsers.set(data.firebaseUid, {
            socketId: socket.id,
            firebaseUid: data.firebaseUid,
            role: data.role,
        });
        console.log(`👤 WebSocket - User ${data.firebaseUid} (${data.role}) enregistré (Server.ts)`);
        socket.emit('registered', { success: true });
    });
    // Déconnexion — déjà gérée dans NotificationGateway, mais ce n’est pas gênant
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚕 Serveur Taxibe en marche sur le port ${PORT}`);
    console.log(`📡 WebSocket prêt sur ws://localhost:${PORT}`);
    console.log(`📚 API Docs disponible sur http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map