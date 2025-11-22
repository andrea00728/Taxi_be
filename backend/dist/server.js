"use strict";
// import app from "./app.js";
// import '@dotenvx/dotenvx/config';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedUsers = exports.notificationGateway = exports.io = void 0;
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(` Serveur Taxibe en marche sur le port ${PORT}`);
// });
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
//  Crée l'instance unique de la Gateway ici
exports.notificationGateway = new notification_gateway_1.NotificationGateway(exports.io);
exports.connectedUsers = new Map();
// Ce bloc est probablement redondant si NotificationGateway gère déjà 'connection'
// Mais gardons-le pour l'instant pour ne rien casser de ta logique d'auth socket existante
exports.io.on('connection', (socket) => {
    // Cette partie gère l'enregistrement utilisateur spécifique
    socket.on('register', (data) => {
        exports.connectedUsers.set(data.firebaseUid, {
            socketId: socket.id,
            firebaseUid: data.firebaseUid,
            role: data.role,
        });
        console.log(`👤 WebSocket - User ${data.firebaseUid} (${data.role}) enregistré (Server.ts)`);
        socket.emit('registered', { success: true });
    });
    // La déconnexion est aussi gérée par NotificationGateway, donc ça fait doublon de logs
    // mais ce n'est pas grave.
});
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚕 Serveur Taxibe en marche sur le port ${PORT}`);
    console.log(`📡 WebSocket prêt sur ws://localhost:${PORT}`);
    console.log(`📚 API Docs disponible sur http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map