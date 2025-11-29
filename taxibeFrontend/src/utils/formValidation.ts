import { Alert } from 'react-native';

export interface LigneFormData {
  nomLigne: string;
  tarif: string;
  depart: string;
  terminus: string;
  districtId: number | null;
}

/**
 * Valide les données d'une ligne pour s'assurer que tous les champs sont remplis.
 * Si un champ est vide ou incorrect, affiche un message d'erreur.
 * Retourne true si toutes les données sont valides, false sinon.
 * @param {LigneFormData} data - Données de la ligne à valider
 * @returns {boolean} - Résultat de la validation (true si valide, false sinon)
 */
export const validateLigneForm = (data: LigneFormData): boolean => {
  if (!data.districtId) {
    Alert.alert('Validation', 'Veuillez sélectionner un district');
    return false;
  }

  if (!data.nomLigne.trim()) {
    Alert.alert('Validation', 'Le nom de la ligne est requis');
    return false;
  }

  if (!data.tarif.trim()) {
    Alert.alert('Validation', 'Le tarif est requis');
    return false;
  }

  if (isNaN(Number(data.tarif)) || Number(data.tarif) <= 0) {
    Alert.alert('Validation', 'Le tarif doit être un nombre positif');
    return false;
  }

  if (!data.depart.trim()) {
    Alert.alert('Validation', 'Le point de départ est requis');
    return false;
  }

  if (!data.terminus.trim()) {
    Alert.alert('Validation', 'Le terminus est requis');
    return false;
  }

  return true;
};
