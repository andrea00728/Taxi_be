// src/components/contribution/LigneForm.tsx
import React, { useState } from 'react';
import { Alert, View, ActivityIndicator, Text, ScrollView } from 'react-native';
import tw from 'twrnc';
import { createLigne } from '@/src/services/api';
import { LigneDto } from '@/src/type/ligneType';
import { useLocationData } from '@/src/hooks/useLocationData';
import { validateLigneForm } from '@/src/utils/formValidation';
import { FormHeader } from '../FormHeader';
import { LocationSection } from '../LocationSection';
import { LineInfoSection } from '../LineInfoSection';
import { SubmitButton } from '../SubmitButton';


interface LigneFormProps {
  onCreated: () => void;
}

export default function LigneForm({ onCreated }: LigneFormProps) {
  // Hook personnalisé pour la gestion des localisations
  const {
    provinces,
    regions,
    districts,
    selectedProvince,
    selectedRegion,
    selectedDistrict,
    setSelectedProvince,
    setSelectedRegion,
    setSelectedDistrict,
    loadingData,
    resetSelections
  } = useLocationData();

  // États du formulaire
  const [nomLigne, setNomLigne] = useState('');
  const [tarif, setTarif] = useState('');
  const [depart, setDepart] = useState('');
  const [terminus, setTerminus] = useState('');
  const [loading, setLoading] = useState(false);

  // Réinitialisation complète du formulaire
  const resetForm = () => {
    setNomLigne('');
    setTarif('');
    setDepart('');
    setTerminus('');
    resetSelections();
  };

  // Soumission du formulaire
  const validerEtEnvoyer = async () => {
    // Validation
    const isValid = validateLigneForm({
      nomLigne,
      tarif,
      depart,
      terminus,
      districtId: selectedDistrict
    });

    if (!isValid) return;

    // Préparation des données
    const data: LigneDto = {
      nom: nomLigne,
      tarif: tarif,
      depart: depart,
      terminus: terminus,
      district_id: selectedDistrict!,
      statut: ''
    };

    try {
      setLoading(true);
      await createLigne(data);

      Alert.alert('✓ Succès', 'Ligne créée avec succès !');
      resetForm();
      onCreated();
    } catch (error: any) {
      console.error('Erreur création ligne:', error.response?.data || error.message);
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Erreur lors de la création de la ligne'
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading initial
  if (loadingData) {
    return (
      <View style={tw`flex-1 justify-center items-center py-10`}>
        <ActivityIndicator size="large" color="#EAB308" />
        <Text style={tw`mt-3 text-gray-600`}>Chargement des données...</Text>
      </View>
    );
  }

  // Rendu principal
  return (
    <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
      <View style={tw`bg-white rounded-xl shadow-sm p-6`}>
        <FormHeader
          showDebug={true}
          provincesCount={provinces.length}
          regionsCount={regions.length}
          districtsCount={districts.length}
        />

        <LocationSection
          provinces={provinces}
          regions={regions}
          districts={districts}
          selectedProvince={selectedProvince}
          selectedRegion={selectedRegion}
          selectedDistrict={selectedDistrict}
          onProvinceChange={setSelectedProvince}
          onRegionChange={setSelectedRegion}
          onDistrictChange={setSelectedDistrict}
        />

        <LineInfoSection
          nomLigne={nomLigne}
          tarif={tarif}
          depart={depart}
          terminus={terminus}
          onNomLigneChange={setNomLigne}
          onTarifChange={setTarif}
          onDepartChange={setDepart}
          onTerminusChange={setTerminus}
        />

        <SubmitButton loading={loading} onPress={validerEtEnvoyer} />
      </View>

    </ScrollView>
  );
}
