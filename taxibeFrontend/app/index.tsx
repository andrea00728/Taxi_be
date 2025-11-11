import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw, { useDeviceContext } from 'twrnc';

import Homescren from "@/src/screens/Homescren";
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import ContributionScreen from '@/src/screens/DefaultLayout';

export type RootStackParamList = {
  Home: undefined;
  Contribution: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Créez un composant séparé pour la navigation
function RootNavigator() {
  const { userToken } = useAuth(); // Récupérez l'état d'authentification
  
  return (
    <Stack.Navigator>
      {userToken == null ? (
        // Écran non authentifié
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => <Homescren {...props} />}
        </Stack.Screen>
      ) : (
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

export default function Page() {
  useDeviceContext(tw);
  return (
    <AuthProvider>
      <NavigationIndependentTree>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </NavigationIndependentTree>
    </AuthProvider>
  );
}
