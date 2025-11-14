import { Arret } from "../type/trajetType";

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
