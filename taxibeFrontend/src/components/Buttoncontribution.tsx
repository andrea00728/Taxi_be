import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import tw from "twrnc";
import LoginScreen from "../screens/Loginscreen";
import RegisterScreen from "../screens/RegistrerScreen";

// Importez les types de navigation
import { RootStackParamList } from '@/app/index'; // Assurez-vous que le chemin est correct
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from "../contexts/AuthContext";

// Définissez les props que le bouton va recevoir
interface ButtonContributionProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}


export default function  ButtonContribution ({ navigation }: ButtonContributionProps) {
  const [visible, setVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const { height } = useWindowDimensions();
   const { login } = useAuth();
  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => {
    setVisible(false);
    setCurrentScreen('login');
  }, []);

  const handleLogin = useCallback((token: string) => {
    console.log("Token reçu, sauvegarde dans le contexte...", token);
    
    // 1. Sauvegarder le token dans le contexte
    login(token);
    
    // 2. Fermer la modale
    setVisible(false);
    setCurrentScreen('login');
    
    // NE PAS appeler navigation.navigate() ici
    // React Navigation va automatiquement naviguer vers le bon écran
  }, [login]);
  const goToRegister = useCallback(() => {
    setCurrentScreen('register');
  }, []);

  const goToLogin = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  const modalHeight = height * 0.7;

  return (
    <View>
      <Pressable
        style={tw`bg-[#427A76] px-4 py-3 rounded-full shadow-lg`}
        android_ripple={{ color: "#f1f1f1" }}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir la contribution"
      >
        <View style={tw`flex-row items-center`}>
          <Ionicons name="heart-outline" size={18} color="#fff" />
          <Text style={tw`text-white font-bold ml-2`}>Connexion</Text>
        </View>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={close}
      >
        <Pressable 
          style={tw`flex-1 mt-100`} 
          onPress={close}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View 
              style={[
                  tw`bg-white rounded-t-3xl px-5 py-4`, // Style pour l'effet "bottom sheet"
                  { minHeight: modalHeight, maxHeight: height * 0.9 }
              ]}
            >
              <View style={tw`flex-row items-center justify-end mb-3`}>
                <Pressable 
                  onPress={close} 
                  accessibilityRole="button" 
                  accessibilityLabel="Fermer"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={28} color="#111" />
                </Pressable>
              </View>
              
              <View style={tw`flex-1`}>
                {currentScreen === 'login' ? (
                  <LoginScreen
                    onLoginSuccess={handleLogin}
                    onForgotPassword={() => {}}
                    onGoRegister={goToRegister}
                  />
                ) : (
                  <RegisterScreen
                    onRegistered={goToLogin}
                    goToLogin={goToLogin}
                  />
                )}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
