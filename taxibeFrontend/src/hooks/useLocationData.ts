import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getProvinces, getRegions } from '@/src/services/api';
import { Province, Region, District } from '@/src/type/ligneType';

export interface SelectOption {
  label: string;
  value: number;
}

/**************************/
/**
 * Hook pour gérer les données de localisation.
 * Fournit les états pour stocker les provinces, les régions et les districts.
 * Fournit également les états pour stocker les sélections de la province, de la région et du district.
 * Fournit enfin les états pour les options filtrées.
 * 
 * @returns {
 *  - provinces: les provinces
 *  - regions: les régions
 *  - districts: les districts
 *  - selectedProvince: l'ID de la province sélectionnée
 *  - selectedRegion: l'ID de la région sélectionnée
 *  - selectedDistrict: l'ID du district sélectionné
 *  - setSelectedProvince: fonction pour mettre à jour l'état de la province sélectionnée

 *  - setSelectedRegion: fonction pour mettre à jour l'état de la région sélectionnée
 *  - setSelectedDistrict: fonction pour mettre à jour l'état du district sélectionné
 *  - loadingData: booléen indiquant si les données sont en train d'être chargées
 *  - resetSelections: fonction pour réinitialiser les sélections de la province, de la région et du district
 */
export const useLocationData = () => {
  // États pour les données brutes
  const [provincesData, setProvincesData] = useState<Province[]>([]);
  const [regionsData, setRegionsData] = useState<Region[]>([]);
  const [districtsData, setDistrictsData] = useState<District[]>([]);

  // États pour les sélections
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  // États pour les options filtrées
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [regions, setRegions] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);

  const [loadingData, setLoadingData] = useState(true);

 
  useEffect(() => {
/**
 * Charge les données de base pour le formulaire de création d'arrêt.
 * Charge les provinces et les régions.
 * Extraie les districts de chaque région.
 * En cas d'erreur, affiche un message d'erreur.
 * En fin de chargement, met à jour l'état de chargement.
 */
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [provincesRes, regionsRes] = await Promise.all([
          getProvinces(),
          getRegions()
        ]);

        console.log('Provinces reçues:', JSON.stringify(provincesRes, null, 2));
        console.log('Régions reçues:', JSON.stringify(regionsRes, null, 2));

        setProvincesData(provincesRes);
        setRegionsData(regionsRes);

        setProvinces(provincesRes.map((p) => ({ 
          label: p.nom, 
          value: p.id 
        })));

        // Extraire tous les districts
        const allDistricts: District[] = [];
        regionsRes.forEach((region) => {
          if (region.districts && Array.isArray(region.districts)) {
            region.districts.forEach((district) => {
              allDistricts.push({
                ...district,
                region_id: region.id
              });
            });
          }
        });
        
        console.log('Districts extraits:', JSON.stringify(allDistricts, null, 2));
        setDistrictsData(allDistricts);

      } catch (error: any) {
        console.error('Erreur chargement:', error.response?.data || error.message);
        Alert.alert('Erreur', 'Impossible de charger les données');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les régions quand une province est sélectionnée
  useEffect(() => {
    if (selectedProvince) {
      console.log('Province sélectionnée:', selectedProvince);
      
      const selectedProv = provincesData.find(p => p.id === selectedProvince);
      if (selectedProv?.regions && Array.isArray(selectedProv.regions)) {
        const filteredRegions = selectedProv.regions.map((r) => ({ 
          label: r.nom, 
          value: r.id 
        }));
        console.log('Régions filtrées (depuis province):', filteredRegions);
        setRegions(filteredRegions);
      } else {
        const allRegions = regionsData.map((r) => ({ 
          label: r.nom, 
          value: r.id 
        }));
        console.log('Toutes les régions:', allRegions);
        setRegions(allRegions);
      }
      
      setSelectedRegion(null);
      setSelectedDistrict(null);
      setDistricts([]);
    } else {
      setRegions([]);
      setDistricts([]);
      setSelectedRegion(null);
      setSelectedDistrict(null);
    }
  }, [selectedProvince, provincesData, regionsData]);

  // Filtrer les districts quand une région est sélectionnée
  useEffect(() => {
    if (selectedRegion) {
      console.log('Région sélectionnée:', selectedRegion);
      
      const selectedReg = regionsData.find(r => r.id === selectedRegion);
      
      if (selectedReg?.districts && Array.isArray(selectedReg.districts)) {
        const filteredDistricts = selectedReg.districts.map((d) => ({ 
          label: d.nom, 
          value: d.id 
        }));
        console.log('Districts filtrés:', filteredDistricts);
        setDistricts(filteredDistricts);
      } else {
        console.log('Aucun district trouvé pour cette région');
        setDistricts([]);
      }
      
      setSelectedDistrict(null);
    } else {
      setDistricts([]);
      setSelectedDistrict(null);
    }
  }, [selectedRegion, regionsData]);

/**
 * Réinitialise les sélections de la province, de la région et du district.
 * Appelé lorsque le formulaire de création d'arrêt est soumis.
 */
  const resetSelections = () => {
    setSelectedProvince(null);
    setSelectedRegion(null);
    setSelectedDistrict(null);
  };

  return {
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
  };
};
