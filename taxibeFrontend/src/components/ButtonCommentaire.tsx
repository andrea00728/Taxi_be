import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { 
  Modal, 
  Pressable, 
  Text, 
  useWindowDimensions, 
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import tw from "twrnc";
import CommentaireScreen from "../screens/ComsScreens";

interface ButtonCommentaireProps {
  ligneId: number;
  ligneName: string;
}

export default function ButtonCommentaire({ ligneId, ligneName }: ButtonCommentaireProps) {
  const [visible, setVisible] = useState(false);
  const { height, width } = useWindowDimensions();

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  const modalHeight = height * 0.85; // 85% de la hauteur
  const modalWidth = width > 600 ? 600 : width * 0.92;

  return (
    <>
      <Pressable
        style={tw`bg-blue-500 ml-auto px-4 py-2 rounded-3xl flex-row items-center mt-2`}
        android_ripple={{ color: "#3B82F6" }}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Voir les commentaires"
      >
        <Ionicons name="chatbubbles" size={18} color="white" />
        <Text style={tw`text-white font-semibold text-sm ml-2`}>Commentaires</Text>
      </Pressable>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={close}
        statusBarTranslucent
      >
          {/* Overlay avec fond noir transparent */}
          <Pressable 
            style={tw`flex-1 bg-black/50 justify-center items-center px-3`}
            onPress={close}
          >
            {/* Modal centré */}
            <Pressable 
              onPress={(e) => e.stopPropagation()}
              style={{ width: modalWidth, maxHeight: modalHeight }}
            >
              <View
                style={[
                  tw`bg-white rounded-3xl shadow-2xl overflow-hidden`,
                  {
                    height: modalHeight,
                    width: '100%',
                  },
                ]}
              >
                {/* Header fixe */}
                <View style={tw`flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-gray-200 bg-white`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xl font-bold text-gray-900`}>Commentaires</Text>
                    <Text style={tw`text-sm text-gray-600 mt-1`} numberOfLines={1}>
                      {ligneName}
                    </Text>
                  </View>
                  <Pressable
                    onPress={close}
                    accessibilityRole="button"
                    accessibilityLabel="Fermer"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={tw`p-1 ml-2`}
                  >
                    <Ionicons name="close-circle" size={28} color="#6B7280" />
                  </Pressable>
                </View>

                {/* Contenu scrollable */}
                <View style={tw`flex-1`}>
                  <CommentaireScreen ligneId={ligneId} />
                </View>
              </View>
            </Pressable>
          </Pressable>
      </Modal>
    </>
  );
}
