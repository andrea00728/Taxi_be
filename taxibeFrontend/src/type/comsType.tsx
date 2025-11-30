export interface comsDTO {
  contenu: string;
  satisfaction: 'decevant' | 'moyen' | 'excellent';
  ligne_id: number;
}

export interface commentaire {
  id: number;
  contenu: string;
  satisfaction: 'decevant' | 'moyen' | 'excellent'; 
  firebase_uid: string;
  ligne?: {
    id: number;
    nom: string;
  };
}
