// export interface Ligne {
//   id: number;
//   nom: string;
//   tarif: string;
//   depart: string;
//   terminus: string;
// }

// export interface Arret {
//   id: number;
//   nom: string;
//   latitude: string;
//   longitude: string;
//   ligne: Ligne;
// }

// export interface TrajetResult {
//   departArrets: Arret[];
//   destArrets: Arret[];
//   suggestions: { type: string; ligne: Ligne }[];
// }




export interface Arret {
  id: number;
  nom: string;
  latitude: string;
  longitude: string;
}

export interface Ligne {
  id: number;
  nom: string;
  depart: string;
  terminus: string;
  tarif: string;
  statut: string;
}

export interface Route {
  type: "direct" | "with_transfer";
  lignes: Ligne[];
  arrets: Arret[];
  transferCount: number;
  estimatedDistance: number;
  totalDistance: number;
  walkingDistance?: number;
  score: number;
  instructions: string[];
}

export interface TrajetResult {
  depart: { query: string; arrets: Arret[] };
  destination: { query: string; arrets: Arret[] };
  routes: Route[];
  totalFound: number;
  filters: { maxTransfers: number; maxWalkingDistance: string; limit: number };
}

export interface TrajectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}