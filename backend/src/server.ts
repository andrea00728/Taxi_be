// import app from "./app.js";
// import '@dotenvx/dotenvx/config';


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(` Serveur Taxibe en marche sur le port ${PORT}`);
// });




import { createServer } from 'http';
import { Server } from 'socket.io';
import app from "./app.js"; 
import '@dotenvx/dotenvx/config';

// IMPORT IMPORTANT : Importe la classe (pas l'instance)
import { NotificationGateway } from './gateway/notification.gateway'; // Ajuste le chemin si besoin

const httpServer = createServer(app);

export const io = new Server(httpServer, {
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
export const notificationGateway = new NotificationGateway(io);


export const connectedUsers = new Map<string, {
  socketId: string;
  firebaseUid: string;
  role: string;
}>();

// Ce bloc est probablement redondant si NotificationGateway gère déjà 'connection'
// Mais gardons-le pour l'instant pour ne rien casser de ta logique d'auth socket existante
io.on('connection', (socket) => {
  // Cette partie gère l'enregistrement utilisateur spécifique
  socket.on('register', (data: { firebaseUid: string; role: string }) => {
    connectedUsers.set(data.firebaseUid, {
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
