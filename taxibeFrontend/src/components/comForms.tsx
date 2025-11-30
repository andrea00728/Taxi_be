import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, Pressable, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { createComs } from "../services/api";
import { comsDTO } from "../type/comsType";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from "../screens/Loginscreen";
import { useAuth } from "../contexts/AuthContext";

interface ComsFormsProps {
  ligneId: number;
  onSuccess: () => void;
}

export default function CommentaireForms({ ligneId, onSuccess }: ComsFormsProps) {
  const [contenu, setContenu] = useState("");
  const [satisfaction, setSatisfaction] = useState<'decevant' | 'moyen' | 'excellent'>('moyen');
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingComment, setPendingComment] = useState <comsDTO | null>(null);
  const { height, width } = useWindowDimensions();
  const { login, userToken } = useAuth();

  useEffect(() => {
    if (userToken && pendingComment) {
      console.log("✅ Token disponible, publication du commentaire en attente");
      publishCommentInBackground(pendingComment);
      setPendingComment(null);
    }
  }, [userToken, pendingComment]);

  const checkAuthentication = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      console.error("Erreur vérification token:", error);
      return false;
    }
  };

  const publishCommentInBackground = async (data: comsDTO) => {
    try {
      console.log("📤 Publication commentaire:", data);
      await createComs(data);
      console.log("✅ Commentaire publié avec succès");
      setContenu("");
      setSatisfaction('moyen');
      onSuccess();
    } catch (error: any) {
      console.error("❌ Erreur publication:", error);
      if (error.response?.status !== 401) {
        Alert.alert("Erreur", "Impossible de publier le commentaire");
      }
    }
  };

  const handleSubmit = async () => {
    if (!contenu.trim()) {
      Alert.alert("Erreur", "Veuillez écrire un commentaire");
      return;
    }

    const data: comsDTO = {
      contenu: contenu.trim(),
      satisfaction,
      ligne_id: ligneId,
    };

    const isAuthenticated = await checkAuthentication();
    
    if (!isAuthenticated) {
      console.log("⚠️ Utilisateur non connecté, ouverture du modal");
      setPendingComment(data);
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      await createComs(data);
      setContenu("");
      setSatisfaction('moyen');
      onSuccess();
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      
      let errorMessage = "Impossible d'ajouter le commentaire";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expirée. Veuillez vous reconnecter.";
        setPendingComment(data);
        setShowLoginModal(true);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (token: string) => {
    console.log("✅ Token reçu, sauvegarde dans le contexte...", token);
    login(token);
    setShowLoginModal(false);
  };

  const modalWidth = width > 600 ? 500 : width * 0.9;
  const modalHeight = height * 0.75;

  return (
    <>
      {/* Card style Facebook */}
      <View style={tw`bg-white rounded-lg mb-2 shadow-sm`}>
         {/* style={tw`bg-blue-500 ml-auto  px-4 py-2 rounded-3xl flex-row items-center mt-2`} */}
        {/* Zone de saisie avec avatar */}
        <View style={tw`p-3`}>
          <View style={tw`flex-row items-start`}>
            {/* Avatar */}
            <View style={tw`w-10 h-10 rounded-full bg-gray-300 items-center justify-center mr-3`}>
              <Ionicons name="person" size={20} color="#FFF" />
            </View>
            
            {/* Input */}
            <View style={tw`flex-1`}>
              <TextInput
                style={tw`bg-[#F0F2F5] rounded-full px-4 py-2 text-gray-900 min-h-10`}
                placeholder="Que pensez-vous de cette ligne ?"
                placeholderTextColor="#65676B"
                multiline
                value={contenu}
                onChangeText={setContenu}
                textAlignVertical="center"
              />
            </View>
          </View>
        </View>

        {/* Réactions Facebook-like */}
        {contenu.length > 0 && (
          <View style={tw`px-3 pb-3`}>
            <View style={tw`flex-row justify-around py-2 border-t border-gray-200`}>
              <TouchableOpacity
                style={tw`flex-1 items-center py-2 rounded-lg ${
                  satisfaction === 'decevant' ? 'bg-red-50' : ''
                }`}
                onPress={() => setSatisfaction('decevant')}
              >
                <Text style={tw`text-2xl mb-1`}>😞</Text>
                <Text style={tw`text-xs ${satisfaction === 'decevant' ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                  Décevant
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 items-center py-2 rounded-lg ${
                  satisfaction === 'moyen' ? 'bg-yellow-50' : ''
                }`}
                onPress={() => setSatisfaction('moyen')}
              >
                <Text style={tw`text-2xl mb-1`}>😐</Text>
                <Text style={tw`text-xs ${satisfaction === 'moyen' ? 'text-yellow-600 font-semibold' : 'text-gray-600'}`}>
                  Moyen
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 items-center py-2 rounded-lg ${
                  satisfaction === 'excellent' ? 'bg-green-50' : ''
                }`}
                onPress={() => setSatisfaction('excellent')}
              >
                <Text style={tw`text-2xl mb-1`}>😍</Text>
                <Text style={tw`text-xs ${satisfaction === 'excellent' ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                  Excellent
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bouton Publier */}
            <TouchableOpacity
              style={tw`bg-[#1877F2] py-2 rounded-lg mt-2 ${loading || !contenu.trim() ? 'opacity-50' : ''}`}
              onPress={handleSubmit}
              disabled={loading || !contenu.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={tw`text-center text-white font-semibold`}>
                  Publier
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal connexion */}
      <Modal
        visible={showLoginModal}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setShowLoginModal(false);
          setPendingComment(null);
        }}
        statusBarTranslucent
      >
        <Pressable 
          style={tw`flex-1 bg-black/50 justify-center items-center px-4`}
          onPress={() => {
            setShowLoginModal(false);
            setPendingComment(null);
          }}
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            style={tw`w-full max-w-md`}
          >
            <View 
              style={[
                tw`bg-white rounded-3xl shadow-2xl`,
                { 
                  minHeight: modalHeight, 
                  maxHeight: height * 0.85,
                  width: modalWidth 
                }
              ]}
            >
              <View style={tw`flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-200`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xl font-bold text-gray-900`}>
                    Connexion requise
                  </Text>
                  <Text style={tw`text-sm text-gray-600 mt-1`}>
                    Connectez-vous pour publier
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    setShowLoginModal(false);
                    setPendingComment(null);
                  }}
                  accessibilityRole="button"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={tw`p-1 ml-2`}
                >
                  <Ionicons name="close-circle" size={28} color="#6B7280" />
                </Pressable>
              </View>

              <View style={tw`flex-1 px-5 py-4`}>
                <LoginScreen
                  onLoginSuccess={handleLoginSuccess}
                  onForgotPassword={() => {}}
                  onGoRegister={() => {}}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
