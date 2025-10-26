import "reflect-metadata";
import { AppDataSource } from "../config/data-source.js";
import { District } from "../entities/districts.js";
export class DistrictService {
    constructor() {
        this.districtRepository = AppDataSource.getRepository(District);
    }
    /**
     * Retrieves all districts from the database, including their associated lignes and arrets.
     *
     * @returns {Promise<District[]>} A promise that resolves to an array of District objects.
     */
    async getAllDistricts() {
        return this.districtRepository.find({ relations: ["lignes", "arrets"] });
    }
    /**
     * Retrieves a district by its ID, including its associated lignes and arrets.
     *
     * @param {number} id The ID of the district to retrieve.
     * @returns {Promise<District | null>} A promise that resolves to the retrieved District object, or null if no district is found.
     */
    async getDistrictById(id) {
        return this.districtRepository.findOne({ where: { id }, relations: ["lignes", "arrets"] });
    }
    /**
     * Creates a new district and persists it to the database.
     * If a regionId is provided in the data, it will be used to create a
     * Region object and associate it with the district.
     *
     * @param {Partial<District> & {region_id?:number}} data The data of the district to create.
     * @returns {Promise<District>} A promise that resolves to the created District object.
     */
    async createDistrict(data) {
        if (data.region_id) {
            data.region = { id: data.region_id };
            delete data.region_id;
        }
        const district = this.districtRepository.create(data);
        return this.districtRepository.save(district);
    }
    /**
     * Deletes a district by its ID.
     *
     * @param {number} id The ID of the district to delete.
     * @returns {Promise<void>} A promise that resolves when the district has been deleted.
     */
    async removeDistrict(id) {
        return this.districtRepository.delete(id);
    }
}
//# sourceMappingURL=districts.service.js.map