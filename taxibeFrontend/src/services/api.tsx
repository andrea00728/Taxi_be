// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../utils/url';
import { Ligne, LigneDto, District, Region, Province, ArretDto, Arret } from '../type/ligneType';
import { CountByDistrictResponse } from '../type/districtType';

const api = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag pour éviter les rafraîchissements multiples
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur de requête pour ajouter le token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        await AsyncStorage.removeItem('userToken');
        processQueue(new Error('Session expirée'), null);
        return Promise.reject(error);
      }
      
      await AsyncStorage.removeItem('userToken');
      processQueue(new Error('Token invalide'), null);
      return Promise.reject(error);

    } catch (refreshError) {
      processQueue(refreshError, null);
      await AsyncStorage.removeItem('userToken');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);


// ==================== SERVICES LIGNE ====================

/**
 * Crée une nouvelle ligne
 * @param data - Données de la ligne à créer
 * @returns Promesse qui résout en la ligne créée
 * @throws Erreur lors de la création de la ligne
 */
export const createLigne = async (data: LigneDto): Promise<Ligne> => {
  try {
    const response = await api.post(`${url}/lignes/create`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la ligne:", error);
    throw error;
  }
};

/**
 * Récupère toutes les lignes
 * @returns Promesse qui résout en un tableau de lignes
 */
export const getAllLignes = async (): Promise<Ligne[]> => {
  try {
    const response = await api.get(`${url}/lignes`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes:", error);
    throw error;
  }
};





/**
 * Récupère toutes les lignes avec statut "Accepted"
 * @returns Promesse qui résout en un tableau de lignes
 */
export const getAllLignesAcceptees = async (): Promise<Ligne[]> => {
  try {
    const response = await api.get(`${url}/lignes`);
    // Filtrer uniquement les lignes avec statut "Accepted"
    const lignesAcceptees = response.data.filter(
      (ligne: Ligne) => ligne.statut === "Accepted"
    );
    return lignesAcceptees;
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes:", error);
    throw error;
  }
};


/**
 * Récupère les lignes créées par l'utilisateur connecté
 * @returns Promesse qui résout en un tableau de lignes
 * @throws Erreur lors de la récupération des lignes
 */
export const getLigneByUser = async (): Promise<Ligne[]> => {
  try {
    const response = await api.get(`${url}/lignes/me`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes:", error);
    throw error;
  }
};


/**
 * Récupère une ligne par son ID
 * @param id - ID de la ligne
 * @returns Promesse qui résout en la ligne trouvée
 */
export const getLigneById = async (id: number): Promise<Ligne> => {
  try {
    const response = await api.get(`${url}/lignes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la ligne ${id}:`, error);
    throw error;
  }
};


export const UpdateStatusLigne =async (id:number,data:Partial<LigneDto>):Promise<Ligne>=> {
  try {
    const response = await api.put(`${url}/lignes/updateStatus/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la ligne ${id}:`, error);
    throw error;
  }
};

/**
 * Met à jour une ligne
 * @param id - ID de la ligne à mettre à jour
 * @param data - Nouvelles données de la ligne
 * @returns Promesse qui résout en la ligne mise à jour
 */
export const updateLigne = async (id: number, data: Partial<LigneDto>): Promise<Ligne> => {
  try {
    const response = await api.put(`${url}/lignes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la ligne ${id}:`, error);
    throw error;
  }
};



/**
 * Supprime une ligne
 * @param id - ID de la ligne à supprimer
 * @returns Promesse qui résout quand la ligne est supprimée
 */
export const deleteLigne = async (id: number): Promise<void> => {
  try {
    await api.delete(`${url}/lignes/remove/${id}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de la ligne ${id}:`, error);
    throw error;
  }
};



// ==================== SERVICES LOCALISATION ====================

/**
 * Récupère toutes les provinces
 * @returns Promesse qui résout en un tableau de provinces
 */
export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await api.get(`${url}/provinces`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des provinces:", error);
    throw error;
  }
};



/**
 * Récupère toutes les régions
 * @returns Promesse qui résout en un tableau de régions
 */
export const getRegions = async (): Promise<Region[]> => {
  try {
    const response = await api.get(`${url}/regions`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des régions:", error);
    throw error;
  }
};



/**
 * Récupère tous les districts
 * @returns Promesse qui résout en un tableau de districts
 */
export const getDistricts = async (): Promise<District[]> => {
  try {
    const response = await api.get(`${url}/districts`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des districts:", error);
    throw error;
  }
};



/**
 * Récupère une province par son ID
 * @param id - ID de la province
 * @returns Promesse qui résout en la province trouvée
 */
export const getProvinceById = async (id: number): Promise<Province> => {
  try {
    const response = await api.get(`${url}/provinces/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la province ${id}:`, error);
    throw error;
  }
};



/**
 * Récupère une région par son ID
 * @param id - ID de la région
 * @returns Promesse qui résout en la région trouvée
 */
export const getRegionById = async (id: number): Promise<Region> => {
  try {
    const response = await api.get(`${url}/regions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la région ${id}:`, error);
    throw error;
  }
};



/**
 * Récupère un district par son ID
 * @param id - ID du district
 * @returns Promesse qui résout en le district trouvé
 */
export const getDistrictById = async (id: number): Promise<District> => {
  try {
    const response = await api.get(`${url}/districts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du district ${id}:`, error);
    throw error;
  }
};


/**
 * Compte le nombre de lignes associées à un district
 * @param id - ID du district
 * @returns Promesse qui résout avec count et nom du district
 */
export const countLigneByDistrict = async (id: number): Promise<CountByDistrictResponse['count']> => {
  try {
    const response = await api.get<CountByDistrictResponse>(`${url}/districts/countByDistrict/${id}`);
    // Retourne l'objet count qui contient {count: number, nom: string}
    return response.data.count;
  } catch (error) {
    console.error("Erreur lors de la récupération des lignes par district:", error);
    throw error;
  }
}



// ==================== SERVICES Des Arretes ====================

/**
 * Crée un nouvel arrêt
 * @param data - Données de l'arrêt à créer
 * @returns Promesse qui résout en l'arrêt créé
 * @throws Erreur lors de la création de l'arrêt
 */
export const createArret = async (data: ArretDto): Promise<Arret> => {
  try {
    const response = await api.post(`${url}/arrets/create`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'arret:", error);
    throw error;
  }
};




export default api;
