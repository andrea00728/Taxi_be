import ResultsSection from "@/src/components/Trajet_component/ResultsSection";
import SearchForm from "@/src/components/Trajet_component/SearchForm";
import { TrajectModalProps, TrajetResult } from "@/src/type/trajetType";
import React, { useState } from "react";
import { View, Modal } from "react-native";
import tw from "twrnc";
const TrajetSearchScreen: React.FC<TrajectModalProps> = ({ 
  visible, 
  onClose, 
  onSuccess 
}) => {
  const [result, setResult] = useState<TrajetResult | null>(null);

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
