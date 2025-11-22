import { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  }, [logout, router]);

  return { handleLogout };
};
