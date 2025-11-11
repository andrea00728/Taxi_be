import React, { useState, useCallback } from "react";
import { View, Text, Pressable, Modal, useWindowDimensions } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import LoginScreen from "../screens/Loginscreen";
import RegisterScreen from "../screens/RegistrerScreen";

// Importez les types de navigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/index'; // Assurez-vous que le chemin est correct

// Définissez les props que le bouton va recevoir
interface ButtonDetailsProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}


export default function ButtonDetails({ navigation }: ButtonDetailsProps) {
  const [visible, setVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const { height } = useWindowDimensions();

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => {
    setVisible(false);
    setCurrentScreen('login');
  }, []);

  const handleLogin = useCallback((token: string) => {
    console.log("Token reçu, navigation en cours...", token);
    
    // 1. Fermer la modale
    setVisible(false);
    
    // 2. Naviguer vers l'écran de Contribution
    navigation.navigate('Contribution');

    // Optionnel : réinitialiser l'écran de la modale pour la prochaine ouverture
    setCurrentScreen('login');
  }, [navigation]);

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
        style={tw`bg-yellow-400  px-2 w-23 ml-20  py-2 rounded-full flex-row items-center`}
        android_ripple={{ color: "#f1f1f1" }}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir details"
      >
        <Text style={tw`text-white font-bold text-sm`}>Details</Text>
        <Ionicons name="lock-closed-outline" size={15} color="white" style={tw`ml-2`} />
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

