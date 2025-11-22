import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  FC
} from "react";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode"; // Assure-toi d'avoir installé : npm install jwt-decode
import { useAuth } from "./AuthContext"; 
import { socketUrl } from "../utils/url";
import { getAllNotification } from "../services/api";
import { Notification } from "../type/notificationType";



interface SocketContextType {
  notifications: Notification[];
  markAsRead: (index: number) => void;
  clearAll: () => void;
}

const SocketContext = createContext<SocketContextType>({
  notifications: [],
  markAsRead: () => {},
  clearAll: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: ReactNode;
}

export const SocketProvider: FC<Props> = ({ children }) => {
  const { userToken, userRole } = useAuth();
  const user = useMemo(() => {
    if (!userToken) return null;
    try {
        const decoded: any = jwtDecode(userToken);
        // Adapte 'uid' ou 'user_id' selon ton token
        return {
            uid: decoded.uid || decoded.user_id || decoded.sub || "unknown",
            role: userRole || decoded.role || "user"
        };
    } catch (e) {
        console.error("Erreur décodage token socket:", e);
        return null;
    }
  }, [userToken, userRole]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      try {
        console.log(" Chargement historique notifications API...");
        const history = await getAllNotification();
        const sortedHistory = history.sort((a: any, b: any) => {
           const dateA = new Date(a.date || a.createdAt || 0).getTime();
           const dateB = new Date(b.date || b.createdAt || 0).getTime();
           return dateB - dateA;
        });
        setNotifications(sortedHistory);
      } catch (err) {
        console.error(" Erreur chargement historique:", err);
      }
    };
    loadHistory();
  }, [user]); // Recharge si l'user change

  // Connexion Socket
  useEffect(() => {
    if (!user) {
      console.log("Pas d'utilisateur (token) pour le socket");
      return;
    }

    console.log(` Connexion socket vers ${socketUrl} pour:`, user.uid);

    const socket: Socket = io(`${socketUrl}`, {
      transports: ["websocket"],
      reconnection: true,
      query: {
        firebaseUid: user.uid,
        role: user.role
      }
    });

    socket.on("connect", () => {
      console.log(" SOCKET CONNECTÉ! ID:", socket.id);
      socket.emit("register", {
        firebaseUid: user.uid,
        role: user.role,
      });
    });

    socket.on("notification", (notif) => {
      console.log(" Notification LIVE reçue:", notif.title);
      setNotifications(prev => [notif, ...prev]);
    });

    socket.on("notifRegister", (notification) => {
        console.log(" Notification ADMIN reçue:", notification.title);
        setNotifications(prev => [notification, ...prev]);
    });

   socket.onAny((event, ...args) => {
      console.log(`DEBUG SOCKET EVENT: ${event}`, args);
    });


    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = (index: number) => {
    setNotifications(prev =>
      prev.map((n, i) => (i === index ? { ...n, isRead: true } : n))
    );
  };

  const clearAll = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{ notifications, markAsRead, clearAll }}>
      {children}
    </SocketContext.Provider>
  );
};
