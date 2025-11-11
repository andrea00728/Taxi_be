export interface Ligne {
  id: number;
  nom: string;
  tarif: string;
  depart: string;
  terminus: string;
}

export interface Arret {
  id: number;
  nom: string;
  latitude: string;
  longitude: string;
  ligne: Ligne;
}

export interface TrajetResult {
  departArrets: Arret[];
  destArrets: Arret[];
  suggestions: { type: string; ligne: Ligne }[];
}