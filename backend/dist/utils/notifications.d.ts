interface Notification {
    type: 'ligne_created' | 'ligne_accepted' | 'ligne_rejected';
    title: string;
    message: string;
    ligne?: {
        id: number;
        nom: string;
        district?: any;
    };
    createdAt: string;
}
/**
 * Envoie une notification à un utilisateur spécifique
 */
export declare const sendNotificationToUser: (firebaseUid: string, notification: Notification) => boolean;
/**
 * Envoie une notification à tous les admins connectés
 */
export declare const sendNotificationToAllAdmins: (notification: Notification) => number;
/**
 * Broadcast à tous les utilisateurs connectés
 */
export declare const broadcastNotification: (notification: Notification) => void;
/**
 * Obtenir le nombre d'utilisateurs connectés
 */
export declare const getConnectedUsersCount: () => number;
/**
 * Obtenir le nombre d'admins connectés
 */
export declare const getConnectedAdminsCount: () => number;
export {};
//# sourceMappingURL=notifications.d.ts.map