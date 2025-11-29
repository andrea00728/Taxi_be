import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Modal, Pressable, Text, useWindowDimensions, View } from "react-native";
import tw from "twrnc";
import LoginScreen from "../screens/Loginscreen";
import RegisterScreen from "../screens/RegistrerScreen";
import { useAuth } from "../contexts/AuthContext";

/**
 * Bouton pour ouvrir la modale du Detail, qui permet de se connecter ou de s'inscrire.
 * La modale est composée d'un écran de login et d'un écran d'inscription.
 * Lorsque le bouton est pressé, la modale s'ouvre.
 * Lorsque le token est reçu, le token est sauvegardé dans le contexte.
 * La navigation se fera automatiquement via le Stack.Navigator conditionnel.
 */
export default function ButtonDetails() {
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
    
    // Sauvegarder le token (le rôle sera extrait automatiquement)
    login(token);
    
    // Fermer la modale
    setVisible(false);
    setCurrentScreen('login');
    
    // La navigation se fera automatiquement via le Stack.Navigator conditionnel
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
          style={tw`flex-1 mt-70`} 
          onPress={close}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View 
              style={[
                tw`bg-white rounded-t-3xl px-5 py-4`,
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



