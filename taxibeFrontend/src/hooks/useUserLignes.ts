// src/screens/Screenuser/hooks/useUserLignes.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { Ligne } from '@/src/type/ligneType';
import { getLigneByUser } from '@/src/services/api';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';

/**
 * Hook qui fournit les lignes associées à l'utilisateur courant.
 * Fournit également des indicateurs de chargement et d'erreur.
 * Les données sont automatiquement mises à jour toutes les 30 secondes si
 * ENABLE_AUTO_REFRESH est à true.
 * @returns Un objet contenant les données des lignes, ainsi que des
 * indicateurs de chargement et d'erreur.
 */
export const useUserLignes = () => {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userToken, logout } = useAuth();
  const router = useRouter();

  const fetchLignes = useCallback(async (isRefreshing = false) => {
    if (!userToken) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (!isRefreshing) {
        setLoading(true);
      }

      const data = await getLigneByUser();
      setLignes(data);
      
      if (isRefreshing && __DEV__) {
        console.log('✓ Lignes utilisateur actualisées');
      }
    } catch (e: any) {
      console.error('Erreur fetchLignes:', e);
      
      if (e.response?.status === 401) {
        Alert.alert(
          'Session expirée',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [
            {
              text: 'OK',
/**
 * Fonction appelée lorsque le bouton "OK" est pressé.
 * Elle logout l'utilisateur et redirige vers la page d accueil.
 */
              onPress: async () => {
                await logout();
                router.replace('/');
              },
            },
          ]
        );
      } else {
        setError('Impossible de récupérer vos lignes');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userToken, logout, router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLignes(true);
  }, [fetchLignes]);

  useEffect(() => {
    fetchLignes();
  }, [fetchLignes]);

  // Grouper les lignes par nom
  const groupedLignes = useCallback(() => {
    const grouped = new Map<string, Ligne[]>();
    
    lignes.forEach(ligne => {
      const existing = grouped.get(ligne.nom.trim());
      if (existing) {
        existing.push(ligne);
      } else {
        grouped.set(ligne.nom.trim(), [ligne]);
      }
    });

    return Array.from(grouped.entries()).map(([nom, lignesGroup]) => ({
      nom,
      lignes: lignesGroup
    }));
  }, [lignes]);

  return {
    lignes,
    groupedLignes: groupedLignes(),
    loading,
    refreshing,
    error,
    onRefresh,
    fetchLignes
  };
};
