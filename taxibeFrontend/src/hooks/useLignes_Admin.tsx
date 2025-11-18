import { useState, useEffect, useCallback, useRef } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { District } from "@/src/type/ligneType";
import { getDistricts } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

const AUTO_REFRESH_INTERVAL = 30000;
const ENABLE_AUTO_REFRESH = true;

export const useLignesAdmin = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const { userToken, logout } = useAuth();
  const router = useRouter();
  const pollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

      const res = await getDistricts();
      setDistricts(res);
      setLastUpdate(new Date());
      
      if (isRefreshing && __DEV__) {
        console.log('✓ Données actualisées:', new Date().toLocaleTimeString());
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
              onPress: async () => {
                await logout();
                router.replace('/');
              },
            },
          ]
        );
      } else if (e.message === 'Network Error') {
        setError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        setError('Impossible de récupérer les données.');
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

    if (ENABLE_AUTO_REFRESH) {
      pollingInterval.current = setInterval(() => {
        fetchLignes(true);
      }, AUTO_REFRESH_INTERVAL);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [fetchLignes]);

  return {
    districts,
    loading,
    refreshing,
    error,
    lastUpdate,
    onRefresh,
    fetchLignes
  };
};
