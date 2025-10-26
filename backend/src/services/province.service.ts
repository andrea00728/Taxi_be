import "reflect-metadata";
import { AppDataSource } from "../config/data-source.js";
import { Province } from "../entities/provinces.js";

export class ProvinceService {
    private provinceRepository = AppDataSource.getRepository(Province);



    /**
     * Retrieves all provinces from the database, including their associated regions, districts and lignes.
     *
     * @returns {Promise<Province[]>} A promise that resolves to an array of Province objects.
     */
    async getAllProvinces(){
        return await this.provinceRepository.find({relations:["regions"]});
    }


    /**
     * Retrieves a province by its ID, including its associated regions, districts and lignes.
     *
     * @param {number} id The ID of the province to retrieve.
     * @returns {Promise<Province | null>} A promise that resolves to the retrieved Province object, or null if no province is found.
     */
    async getProvinceById(id:number){
        return await this.provinceRepository.findOne(
            {where:{id},relations:["regions"]}
        );
    }


    /**
     * Creates a new province and persists it to the database.
     *
     * @param {Partial<Province>} data The data of the province to create.
     * @returns {Promise<Province>} A promise that resolves to the created Province object.
     */
    async createProvince(data:Partial<Province>){
        const province = this.provinceRepository.create(data);
        return await this.provinceRepository.save(province);
    }


    /**
     * Deletes a province by its ID.
     *
     * @param {number} id The ID of the province to delete.
     * @returns {Promise<void>} A promise that resolves when the province has been deleted.
     */
    async removeProvince(id:number){
        return await this.provinceRepository.delete({id});
    }

}