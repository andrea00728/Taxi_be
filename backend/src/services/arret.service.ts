import { AppDataSource } from "../config/data-source.js";
import { Arret } from "../entities/Arret.js";
import { Ligne } from "../entities/Ligne.js";

export class ArretService {
    private arretRepository = AppDataSource.getRepository(Arret);


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
 * Creates a new arret and persists it to the database.
 * If a ligneId is provided in the data, it will be used to create a
 * Ligne object and associate it with the arret.
 *
 * @param {Partial<Arret> & { ligneId?: number }} data The data of the arret to create.
 * @returns {Promise<Arret>} A promise that resolves to the created Arret object.
 */
  async createArret(data: Partial<Arret> & { ligneId?: number }) {
  if (data.ligneId) {
    data.ligne = { id: data.ligneId } as Ligne;
    delete data.ligneId;
  }
  const arret = this.arretRepository.create(data);
  return this.arretRepository.save(arret);
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
     * Retrieves all arrets with a name that matches the given name.
     * The search is case-insensitive.
     *
     * @param {string} name The name to search for.
     * @returns {Promise<Arret[]>} A promise that resolves to an array of Arret objects.
     */
    async findByName(name:string){
        return await this.arretRepository.createQueryBuilder("arret")
        .where("LOWER(arret.nom) LIKE LOWER(:name)",{name:`%${name}%`})
        .leftJoinAndSelect("arret.ligne","ligne")
        .getMany();
    }
}
