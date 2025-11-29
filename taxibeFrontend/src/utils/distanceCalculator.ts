import { Arret } from "../type/trajetType";

/**
 * Calcul la distance entre deux arrêts.
 * Si l'un des deux arrêts est undefined, la fonction retourne 0.
 * La distance est calculée en utilisant la formule de Haversine.
 * @param {Arret | undefined} arret1 - Premier arrêt.
 * @param {Arret | undefined} arret2 - Deuxième arrêt.
 * @returns {number} La distance entre les deux arrêts en mètres.
 */
export const calculateDistance = (
  arret1: Arret | undefined, 
  arret2: Arret | undefined
): number => {
  if (!arret1 || !arret2) return 0;
  
  const lat1 = parseFloat(arret1.latitude);
  const lon1 = parseFloat(arret1.longitude);
  const lat2 = parseFloat(arret2.latitude);
  const lon2 = parseFloat(arret2.longitude);

  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
