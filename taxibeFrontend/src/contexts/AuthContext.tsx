import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  uid: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  userToken: string | null;
  userRole: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider est un composant qui fournit un contexte d'authentification à ses enfants.
 * Il utilise AsyncStorage pour stocker et récupérer le token d'authentification ainsi que le rôle de l'utilisateur.
 * Le contexte d'authentification est défini par les valeurs suivantes :
 * - userToken : le token d'authentification de l'utilisateur (string | null)
 * - userRole : le rôle de l'utilisateur (string | null)
 * - login : une fonction qui permet de sauvegarder le token et le rôle de l'utilisateur
 * - logout : une fonction qui permet de supprimer le token et le rôle de l'utilisateur
 * - isLoading : un boolean qui indique si le composant est en train de charger le token et le rôle
 * Lorsque le composant est monté, il charge le token et le rôle de l'utilisateur en utilisant useEffect.
 * Si le token et le rôle sont trouvés, ils sont sauvegardés dans le state du composant.
 * Si le token et le rôle ne sont pas trouvés, ils sont initialisés à null.
 * Les fonctions login et logout permettent de mettre à jour le state du composant en conséquence.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le token et le rôle au démarrage
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        
        if (token && role) {
          setUserToken(token);
          setUserRole(role);
        }
      } catch (e) {
        console.error('Erreur lors du chargement du token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

/**
 * Sauvegarde le token et le rôle de l'utilisateur.
 * @param {string} token - Le token d'authentification de l'utilisateur.
 * @throws {Error} - Si une erreur survient lors de la sauvegarde du token.
 */
  const login = async (token: string) => {
    try {
      // Décoder le token pour extraire le rôle
      const decoded: DecodedToken = jwtDecode(token);
      const role = decoded.role;

      // Sauvegarder le token et le rôle
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role);
      
      setUserToken(token);
      setUserRole(role);
      
      console.log('Token et rôle sauvegardés:', { token, role });
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du token:', e);
    }
  };

/**
 * Supprime le token et le rôle de l'utilisateur.
 * Cette fonction est asynchrone et renvoie une promesse qui résout en erreur si une erreur survient lors de la suppression du token.
 */
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      setUserToken(null);
      setUserRole(null);
    } catch (e) {
      console.error('Erreur lors de la suppression du token:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Récupère le contexte d'authentification.
 * Retourne l'objet contenant le token, le rôle, les fonctions de login et de logout ainsi que l'état d'attente.
 * Cette fonction doit être utilisée à l'intérieur d'un composant <AuthProvider>.
 * @throws {Error} si la fonction est utilisée en dehors d'un composant <AuthProvider>
 * @returns {AuthContextType} le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
