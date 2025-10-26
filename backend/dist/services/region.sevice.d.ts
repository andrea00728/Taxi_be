import "reflect-metadata";
import { Region } from "../entities/regions.js";
export declare class RegionService {
    private regisionRepository;
    /**
     * Retrieves all regions from the database, including their associated districts.
     *
     * @returns {Promise<Region[]>} A promise that resolves to an array of Region objects.
     */
    getAllRegion(): Promise<Region[]>;
    /**
     * Retrieves a region by its ID, including its associated districts.
     *
     * @param {number} id The ID of the region to retrieve.
     * @returns {Promise<Region | null>} A promise that resolves to the retrieved Region object, or null if no region is found.
     */
    getRegionById(id: number): Promise<Region | null>;
    /**
     * Creates a new region and persists it to the database.
     * If a provinceId is provided in the data, it will be used to create a
     * Province object and associate it with the region.
     *
     * @param {Partial<Region> & { province_id?: number }} data The data of the region to create.
     * @returns {Promise<Region>} A promise that resolves to the created Region object.
     */
    createRegion(data: Partial<Region> & {
        province_id?: number;
    }): Promise<Region>;
    /**
     * Deletes a region by its ID.
     *
     * @param {number} id The ID of the region to delete.
     * @returns {Promise<void>} A promise that resolves when the region has been deleted.
     */
    removeRegion(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=region.sevice.d.ts.map