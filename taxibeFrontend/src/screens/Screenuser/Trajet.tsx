import ResultsSection from "@/src/components/Trajet_component/ResultsSection";
import SearchForm from "@/src/components/Trajet_component/SearchForm";
import { TrajectModalProps, TrajetResult } from "@/src/type/trajetType";
import React, { useState } from "react";
import { View, Modal } from "react-native";
import tw from "twrnc";
/**
 * Écran de recherche de trajet.
 * Affiche un formulaire de recherche et un resultat si la recherche abouti.
 * Le formulaire de recherche est fermé et le modal est fermé
 * lorsque le bouton "Fermer" est pressé.
 * Si la recherche abouti, le résultat est affiché.
 * Lorsque le formulaire de recherche est validé, charge la mise à jour de la liste des lignes.
 * Si la création réussit, ferme le modal et réinitialise l'indicateur de chargement à false.
 * Si une erreur survient, affiche un message d'erreur.
 * Enfin, réinitialise l'indicateur de chargement à false.
 * @param {TrajectModalProps} props - Informations de fermeture pour le modal.
 * @param {boolean} props.visible - Indicateur pour savoir si le modal est visible.
 * @param {() => void} props.onClose - Fonction appelée lorsque le bouton "Fermer" est pressé.
 * @param {(result: TrajetResult) => void} props.onResult - Fonction appelée lorsque la recherche a abouti.
 */
const TrajetSearchScreen: React.FC<TrajectModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const [result, setResult] = useState<TrajetResult | null>(null);

/**
 * Réinitialise le résultat de la recherche et ferme le modal.
 */
  const resetAndClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      onRequestClose={resetAndClose}
    >
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-5 max-h-[90%]`}>
          <SearchForm 
            onClose={resetAndClose} 
            onResult={setResult} 
          />
          {result && <ResultsSection result={result} />}
        </View>
      </View>
    </Modal>
  );
};

export default TrajetSearchScreen;
