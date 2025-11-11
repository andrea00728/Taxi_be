import React, { useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { District, Ligne } from "@/src/type/ligneType";
import { LigneCard, GroupedLigne } from "./LigneCard";

interface DistrictSectionProps {
  district: District;
}

export const DistrictSection = React.memo(({ district }: DistrictSectionProps) => {
  // Fonction pour grouper les lignes par nom
  const groupLignesByName = useCallback((lignes: Ligne[]): GroupedLigne[] => {
    const grouped = new Map<string, GroupedLigne>();

    lignes.forEach(ligne => {
      const nom = ligne.nom.trim();
      const existing = grouped.get(nom);

      if (existing) {
        // Détermine la direction basée sur le nombre de trajets existants
        const direction: 'aller' | 'retour' = existing.trajets.length === 0 ? 'aller' : 'retour';
        
        existing.trajets.push({
          id: ligne.id,
          depart: ligne.depart,
          terminus: ligne.terminus,
          direction: direction
        });
      } else {
        grouped.set(nom, {
          nom: nom,
          tarif: ligne.tarif,
          arrets: ligne.arrets,
          trajets: [{
            id: ligne.id,
            depart: ligne.depart,
            terminus: ligne.terminus,
            direction: 'aller'
          }]
        });
      }
    });

    return Array.from(grouped.values());
  }, []);

  const groupedLignes = useMemo(() => {
    if (!district.lignes || district.lignes.length === 0) return [];
    return groupLignesByName(district.lignes);
  }, [district.lignes, groupLignesByName]);

  if (groupedLignes.length === 0) return null;

  return (
    <View style={tw`mb-6 px-5`}>
      <View style={tw`flex-row items-center mb-3`}>
        <View style={tw`h-8 w-1 bg-yellow-400 mr-3`} />
        <Text style={tw`text-2xl font-bold text-yellow-400`}>
          {district.nom}
        </Text>
      </View>
      {groupedLignes.map((ligneGroup, index) => (
        <LigneCard key={`${ligneGroup.nom}-${index}`} ligneGroup={ligneGroup} />
      ))}
    </View>
  );
});
