import "reflect-metadata";
import { District } from "../entities/districts.js";
export declare class DistrictService {
    private districtRepository;
    /**
     * Retrieves all districts from the database, including their associated lignes and arrets.
     *
     * @returns {Promise<District[]>} A promise that resolves to an array of District objects.
     */
    getAllDistricts(): Promise<District[]>;
    /**
     * Retrieves a district by its ID, including its associated lignes and arrets.
     *
     * @param {number} id The ID of the district to retrieve.
     * @returns {Promise<District | null>} A promise that resolves to the retrieved District object, or null if no district is found.
     */
    getDistrictById(id: number): Promise<District | null>;
    /**
     * Creates a new district and persists it to the database.
     * If a regionId is provided in the data, it will be used to create a
     * Region object and associate it with the district.
     *
     * @param {Partial<District> & {region_id?:number}} data The data of the district to create.
     * @returns {Promise<District>} A promise that resolves to the created District object.
     */
    createDistrict(data: Partial<District> & {
        region_id?: number;
    }): Promise<District>;
    /**
     * Deletes a district by its ID.
     *
     * @param {number} id The ID of the district to delete.
     * @returns {Promise<void>} A promise that resolves when the district has been deleted.
     */
    removeDistrict(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=districts.service.d.ts.map