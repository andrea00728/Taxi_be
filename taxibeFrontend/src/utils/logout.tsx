import { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

/**
 * Hook qui fournit une fonction permettant de se déconnecter.
 * La fonction Alerte l'utilisateur avant de le déconnecter et le redirige
 * vers la page d'accueil si il confirme la déconnexion.
 * @returns Un objet contenant la fonction de déconnexion.
 */
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
/**
 * Fonction appelée lorsque le bouton "Déconnecter" est pressé.
 * Elle logout l'utilisateur et redirige vers la page d'accueil.
 */
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
