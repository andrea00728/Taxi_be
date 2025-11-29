
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LigneScreen from '../Screenuser/LigneScreen';
import AjoutContributionScreen from '../Screenuser/AjoutContribution';
import MapScreen from '../Screenuser/MapScreen';
import NotificationScreen from '../Screenuser/HistoriqueScreen';
import tw from "twrnc";
import DashboardAdmin from './Dashboard';
import LigneScreenAdmin from './LigneScreen_Admin';
import { useSocket } from '@/src/contexts/socketContext';
import { useAuth } from '@/src/contexts/AuthContext';

const Tab = createBottomTabNavigator();


/**
 * ContributionScreen est le composant principal de l'application pour les utilisateurs.
 * Il est composé d'un BottomTabNavigator qui permet de naviguer entre les différentes écrans de l'application.
 * Les écrans disponibles sont :
 * - Dashboard : écran d'accueil de l'application qui affiche les informations de base de l'utilisateur.
 * - Ligne : écran qui permet de consulter les lignes de bus.
 * - Ajouter : écran qui permet d'ajouter une nouvelle contribution.
 * - Map : écran qui permet de consulter la carte.
 * - Notifications : écran qui affiche les notifications de l'application.
 * Le badge de l'onglet Notifications affiche le nombre de notifications non lues.
 */
export default function ContributionScreen() {

    const { notifications } = useSocket();
    // const unreadCount = notifications.filter(n => !n.isRead).length;
    const { userRole } = useAuth();
     const unreadCount = notifications.filter(n => {
        //  Si déjà lu, on ignore
        if (n.isRead) return false;

        //  Applique EXACTEMENT le même filtre que dans NotificationScreen
        const title = (n.title || "").toLowerCase();
        
        // Cas Admin
        if (title.includes("nouvelle ligne") || title.includes("nouveelle ligne")) {
            return userRole === "admin";
        }
        // Cas User
        if (title.includes("changement de statut") || title.includes("statut modifié")) {
            return userRole === "user";
        }
        // Par défaut visible
        return true;
    }).length;
    return (
        <Tab.Navigator
            initialRouteName="dashboard"
            screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: '#FCB53B',
                    tabBarInactiveTintColor: '#9CA3AF',
                    tabBarStyle: {
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 2,
                        borderTopColor: '#F3F4F6',
                        height: 85,
                        paddingBottom: 16,
                        paddingTop: 8,
                        elevation: 15,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        marginTop: 4,
                    },
                }}
        >
            <Tab.Screen 
                name="dashboard" 
                component={DashboardAdmin}
                options={{
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ focused, color }) => (
                            <View style={tw`items-center justify-center`}>
                                <View 
                                    style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                                        focused ? 'bg-yellow-100' : 'bg-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                      name={focused ? 'stats-chart' : 'stats-chart-outline'}

                                        size={24}
                                        color={color}
                                    />
                                </View>
                            </View>
                        ),
                    }}
            />
            <Tab.Screen 
                name="Ligne" 
                component={LigneScreenAdmin}
                options={{
                        tabBarLabel: 'Bus',
                        tabBarIcon: ({ focused, color }) => (
                            <View style={tw`items-center justify-center`}>
                                <View 
                                    style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                                        focused ? 'bg-yellow-100' : 'bg-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                        name={focused ? 'bus-outline' : 'bus-outline'} 
                                        size={24}
                                        color={color}
                                    />
                                </View>
                            </View>
                        ),
                    }}
            />
            <Tab.Screen 
                name="Ajouter" 
                component={AjoutContributionScreen} 
                options={{
                        tabBarLabel: 'Contribution',
                        tabBarIcon: ({ focused, color }) => (
                            <View style={tw`items-center justify-center`}>
                                <View 
                                    style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                                        focused ? 'bg-yellow-100' : 'bg-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                        name={focused ? 'add-circle-outline' : 'add-circle-outline'} 
                                        size={24}
                                        color={color}
                                    />
                                </View>
                            </View>
                        ),
                    }}
            />
            <Tab.Screen 
                name="Map" 
                component={MapScreen} 
                options={{
                        tabBarLabel: 'Map',
                        tabBarIcon: ({ focused, color }) => (
                            <View style={tw`items-center justify-center`}>
                                <View 
                                    style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                                        focused ? 'bg-yellow-100' : 'bg-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                        name={focused ? 'map-outline' : 'map-outline'} 
                                        size={24}
                                        color={color}
                                    />
                                </View>
                            </View>
                        ),
                    }}
            />
                <Tab.Screen 
                name="notifications" 
                component={NotificationScreen} 
                options={{
                        tabBarLabel: 'notifications',
                        
                        // 2. AJOUTE CETTE LIGNE ICI :
                        tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
                        
                        tabBarIcon: ({ focused, color }) => (
                            <View style={tw`items-center justify-center`}>
                                <View 
                                    style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                                        focused ? 'bg-yellow-100' : 'bg-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                        name={focused ? 'notifications' : 'notifications-outline'} 
                                        size={24}
                                        color={color}
                                    />
                                </View>
                            </View>
                        ),
                    }}
            />
        </Tab.Navigator>
    );
}
