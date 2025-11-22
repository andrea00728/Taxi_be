export interface NotificationData {
  id: number;
  title: string;
  message: string;
  type?: string;
  date?: string;
  isRead?: boolean;
}


export interface Notification {
  id?: number;
  type?: string;
  title: string;
  message: string;
  date?: string;
  createdAt?: string;
  ligne?: {
    id: number;
    nom: string;
    nom_ligne?: string;
    district?: {
        id: number;
        nom: string;
    };
  };
  isRead?: boolean;
}