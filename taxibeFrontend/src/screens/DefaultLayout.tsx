import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LigneScreen from './Screenuser/LigneScreen';
import AjoutContributionScreen from './Screenuser/AjoutContribution';
import MapScreen from './Screenuser/MapScreen';
import tw from "twrnc";
import NotificationScreen from './Screenuser/HistoriqueScreen';

const Tab = createBottomTabNavigator();

// --- Le composant ContributionScreen devient le conteneur du menu ---
export default function ContributionScreen() {
    return (
        <Tab.Navigator
            initialRouteName="Ligne"
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
                name="Ligne" 
                component={LigneScreen}
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
                        tabBarIcon: ({ focused, color }) => (
                            <View style={tw`items-center justify-center`}>
                                <View 
                                    style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                                        focused ? 'bg-yellow-100' : 'bg-transparent'
                                    }`}
                                >
                                    <Ionicons 
                                        name={focused ? 'notifications-outline' : 'notifications-outline'} 
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
