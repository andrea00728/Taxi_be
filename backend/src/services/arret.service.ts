import { AppDataSource } from "../config/data-source.js";
import { Arret } from "../entities/Arret.js";
import { Ligne } from "../entities/Ligne.js";

export class ArretService {
    private arretRepository = AppDataSource.getRepository(Arret);
    private ligneRepository =AppDataSource.getRepository(Ligne);

    /**
     * Retrieves all arrets from the database, including their associated lignes.
     *
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    async getAllArrets(){
        return await this.arretRepository.find(
            {relations:["ligne"]}
        );
    }






/**
 * Normalizes a given string by decomposing accented characters, removing accents and apostrophes, normalizing spaces, converting to lowercase, and trimming.
 * @param {string} str The string to normalize.
 * @returns {string} The normalized string.
 */
 private normalizeString(str: string): string {
  return str
    .normalize("NFD") // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[''`´]/g, "") // Supprime les apostrophes
    .replace(/\s+/g, " ") // Normalise les espaces
    .toLowerCase()
    .trim();
}




    /**
     * Retrieves an arret by its ID, including its associated ligne.
     *
     * @param {number} id The ID of the arret to retrieve.
     * @returns {Promise<Arret | null>} A promise that resolves to the retrieved Arret object, or null if no arret is found.
     */
    async getArretById(id:number){
        return await this.arretRepository.findOne(
            {where:{id},
            relations:["ligne"]}
        );
    }






    /**
     * Retrieves all arrets associated with a given Firebase user ID.
     * The associated ligne of each arret is also included in the result.
     *
     * @param {string} firebase_uid The Firebase user ID to retrieve arrets for.
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
        async getArretByUser(firebase_uid:string){
        return this.arretRepository.find({
            where:{firebase_uid},
            relations:["ligne"]
        });
    }



  


    /**
     * Creates a new arret and persists it to the database.
     * If the arret has a "nomigne" property, it is used to retrieve the associated ligne
     * by its name. If the ligne does not exist, an error is thrown.
     *
     * @param {Partial<Arret> & {nomigne?: string}} data The data of the arret to create.
     * @param {string} firebaseUid The Firebase user ID associated with the arret.
     * @returns {Promise<Arret>} A promise that resolves to the created Arret object.
     * @throws {Error} If the ligne associated with the arret does not exist.
     */

async createArret(
  data: Partial<Arret> & { nomligne?: string },
  firebaseUid: string
) {
  if (!data.nomligne) {
    throw new Error("nomligne est requis");
  }

  if (!data.nom || data.latitude == null || data.longitude == null) {
    throw new Error("nom, latitude, longitude sont obligatoires");
  }

  // 1 Trouver toutes les lignes portant ce nom
  const lignes = await this.ligneRepository.find({
    where: { nom: data.nomligne },
    relations: ["arrets"],
  });

  if (lignes.length === 0) {
    throw new Error(`La ligne '${data.nomligne}' n'existe pas`);
  }

  // 2 Créer l’arrêt
  const arret = this.arretRepository.create({
    nom: data.nom,
    latitude: data.latitude,
    longitude: data.longitude,
    firebase_uid: firebaseUid,
  });

  const newArret = await this.arretRepository.save(arret);

  // 3  Ajouter l’arrêt à toutes les lignes
  for (const ligne of lignes) {
    if (!ligne.arrets) ligne.arrets = []; // sécurité
    ligne.arrets.push(newArret);
    await this.ligneRepository.save(ligne);
  }

  return {
    message: `Arrêt ajouté à ${lignes.length} ligne(s) nommées '${data.nomligne}'`,
    arret: newArret,
  };
}




    /**
     * Updates an arret by its ID.
     *
     * @param {number} id The ID of the arret to update.
     * @param {Partial<Arret>} data The data to update the arret with.
     * @returns {Promise<Arret>} A promise that resolves to the updated Arret object.
     */
    async updateArret(id:number,data:Partial<Arret>){
        await this.arretRepository.update({id},data);
        return this.getArretById(id);
    }





    /**
     * Deletes an arret by its ID.
     *
     * @param {number} id The ID of the arret to delete.
     * @returns {Promise<void>} A promise that resolves when the arret has been deleted.
     */
    async deleteArret(id:number){
        return this.arretRepository.delete(id);
    }





 /**
 * Recherche d'arrêts avec normalisation (ignore accents, apostrophes, casse)
 * @param {string} name Le nom à rechercher
 * @returns {Promise<Arret[]>} Une liste d'arrêts correspondants
 */
async findByName(name: string): Promise<Arret[]> {
  // Normaliser le terme de recherche
  const normalizedSearch = this.normalizeString(name);
  
  console.log(`🔍 Recherche d'arrêts: "${name}" → normalisé: "${normalizedSearch}"`);

  // Récupérer tous les arrêts avec leurs lignes
  const allArrets = await this.arretRepository
    .createQueryBuilder("arret")
    .leftJoinAndSelect("arret.ligne", "ligne")
    .getMany();

  // Filtrer avec normalisation
  const matchingArrets = allArrets.filter((arret) => {
    const normalizedName = this.normalizeString(arret.nom);
    return normalizedName.includes(normalizedSearch);
  });

  console.log(`    ${matchingArrets.length} arrêt(s) trouvé(s)`);
  matchingArrets.forEach(a => {
    console.log(`      - ${a.nom} (${a.ligne?.nom || "Sans ligne"})`);
  });

  return matchingArrets;
}



  /**
   * Trouver tous les arrêts d'une ligne spécifique
   *
   * @param {number} ligneId L'ID de la ligne
   * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
   */
  async findByLigneId(ligneId: number): Promise<Arret[]> {
    try {
      return await this.arretRepository.find({
        where: { ligne: { id: ligneId } },
        relations: ["ligne"],
        order: { nom: "ASC" },
      });
    } catch (error) {
      console.error("Erreur lors de la recherche des arrêts par ligne:", error);
      throw new Error("Impossible de récupérer les arrêts de cette ligne");
    }
  }





  /**
   * Trouver toutes les lignes qui passent par un arrêt (par nom)
   *
   * @param {string} arretName Le nom de l'arrêt à rechercher
   * @returns {Promise<Ligne[]>} A promise that resolves to an array of unique Ligne objects.
   */
  async findLignesByArretName(arretName: string): Promise<Ligne[]> {
    try {
      // Rechercher les arrêts correspondants au nom
      const arrets = await this.arretRepository
        .createQueryBuilder("arret")
        .where("LOWER(arret.nom) LIKE LOWER(:name)", {
          name: `%${arretName}%`,
        })
        .leftJoinAndSelect("arret.ligne", "ligne")
        .getMany();

      // Extraire les lignes uniques
      const lignesMap = new Map<number, Ligne>();
      arrets.forEach((arret) => {
        if (arret.ligne && !lignesMap.has(arret.ligne.id)) {
          lignesMap.set(arret.ligne.id, arret.ligne);
        }
      });

      return Array.from(lignesMap.values());
    } catch (error) {
      console.error(
        "Erreur lors de la recherche des lignes par arrêt:",
        error
      );
      throw new Error("Impossible de récupérer les lignes pour cet arrêt");
    }
  }

 



/**
 * Trouver les arrêts à proximité d'un point GPS (formule de Haversine)
 *
 * @param {number} lat La latitude du point de recherche
 * @param {number} lon La longitude du point de recherche
 * @param {number} [radius=500] Le rayon de recherche en mètres
 * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects sorted by distance.
 */
async findNearby(
  lat: number,
  lon: number,
  radius: number = 500
): Promise<Arret[]> {
  try {
    const allArrets = await this.arretRepository
      .createQueryBuilder("arret")
      .where("arret.latitude IS NOT NULL")
      .andWhere("arret.longitude IS NOT NULL")
      .leftJoinAndSelect("arret.ligne", "ligne")
      .getMany();

    const nearbyArrets = allArrets.filter((arret) => {
      // Pas besoin de parseFloat si latitude/longitude sont déjà des numbers
      const distance = this.calculateDistance(
        lat,
        lon,
        arret.latitude,
        arret.longitude
      );
      return distance <= radius;
    });

    nearbyArrets.sort((a, b) => {
      const distA = this.calculateDistance(
        lat,
        lon,
        a.latitude,
        a.longitude
      );
      const distB = this.calculateDistance(
        lat,
        lon,
        b.latitude,
        b.longitude
      );
      return distA - distB;
    });

    return nearbyArrets;
  } catch (error) {
    console.error("Erreur lors de la recherche des arrêts à proximité:", error);
    throw new Error("Impossible de récupérer les arrêts à proximité");
  }
}




/**
 * Calculer la distance entre deux points sur la surface de la Terre
 * en utilisant la formule de Haversine.
 * @param {number} lat1 Latitude du premier point
 * @param {number} lon1 Longitude du premier point
 * @param {number} lat2 Latitude du second point
 * @param {number} lon2 Longitude du second point
 * @returns {number} Distance entre les deux points en mètres
 */
private calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

}
