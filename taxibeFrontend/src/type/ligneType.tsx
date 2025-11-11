// --- Interfaces Corrigées ---
export interface Arret {
  id: number;
  nom: string;
  latitude: string;
  longitude: string;
}

export interface ArretDto {
  nom: string;
  latitude: string;
  longitude: string;
  nomligne: string;
}

export interface LocationCoords{
  latitude: number;
  longitude: number;
}

export interface Ligne {
  statut: string;
  id: number;
  nom: string;
  tarif: string;
  depart: string;
  terminus: string;
  arrets: Arret[];
}

export interface District {
  id: number;
  nom: string;
  region_id?: number;
  lignes: Ligne[];
  arrets?: Arret[];
}

export interface LigneDto{
  nom: string;
  tarif: string;
  depart: string;
  terminus: string;
  district_id: number;
}


export interface Province {
  id: number;
  nom: string;
  regions?: Region[];
}

export interface Region {
  id: number;
  nom: string;
  province_id?: number;
  districts: District[];
}