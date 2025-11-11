// src/screens/Screenuser/components/StatusBadge.tsx
import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StatusBadgeProps {
  status: string;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'actif':
    case 'active':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: 'checkmark-circle' as const,
        iconColor: '#15803d',
        label: 'Actif'
      };
    case 'attent':
    case 'en attente':
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: 'time' as const,
        iconColor: '#a16207',
        label: 'En attente'
      };
    case 'inactif':
    case 'inactive':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: 'pause-circle' as const,
        iconColor: '#374151',
        label: 'Inactif'
      };
    case 'rejeté':
    case 'rejected':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: 'close-circle' as const,
        iconColor: '#b91c1c',
        label: 'Rejeté'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: 'ellipse' as const,
        iconColor: '#6b7280',
        label: status
      };
  }
};

export const StatusBadge = React.memo(({ status }: StatusBadgeProps) => {
  const config = getStatusConfig(status);
  
  return (
    <View style={tw`flex-row items-center ${config.bg} px-3 py-1.5 rounded-full`}>
      <Ionicons name={config.icon} size={16} color={config.iconColor} />
      <Text style={tw`${config.text} font-semibold text-xs ml-1.5`}>
        {config.label}
      </Text>
    </View>
  );
});
