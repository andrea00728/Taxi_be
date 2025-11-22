import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw, { useDeviceContext } from 'twrnc';

import Homescren from "@/src/screens/Homescren";
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import ContributionScreen from '@/src/screens/DefaultLayout';
import { ActivityIndicator, View } from 'react-native';
import AdminLayout from '@/src/screens/AdminScreens/AdminLayout';
import { SocketProvider } from '@/src/contexts/socketContext';

export type RootStackParamList = {
  Home: undefined;
  Contribution: undefined;
  AdminApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Créez un composant séparé pour la navigation
function RootNavigator() {
  const { userToken,userRole,isLoading } = useAuth(); // Récupérez l'état d'authentification


  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#FCB53B" />
      </View>
    );
  }


  return (
    <Stack.Navigator>
      {!userToken ? (
        // Écran non authentifié
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => <Homescren {...props} />}
        </Stack.Screen>
      ) : userRole==="admin" ?(
        <Stack.Screen name="AdminApp" component={AdminLayout} options={{headerShown:false}}/>
      ): (
        // Écran authentifié
        <Stack.Screen
          name="Contribution"
          component={ContributionScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

/**
 * Page est le composant racine de l'application.
 * Il utilise les hook useDeviceContext pour charger les styles de Tailwind
 * et il wrap le composant <RootNavigator> avec un composant <AuthProvider>
 * pour gérer l'authentification.
 * Il utilise également le composant <Navigation IndependentTree> et <NavigationContainer>
 * pour gérer la navigation.
 */
export default function Page() {
  useDeviceContext(tw);
  return (
    <AuthProvider>
      <SocketProvider>
        <NavigationIndependentTree>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </NavigationIndependentTree>
      </SocketProvider>
    </AuthProvider>
  );
}

