"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionService = void 0;
require("reflect-metadata");
const data_source_js_1 = require("../config/data-source.js");
const regions_js_1 = require("../entities/regions.js");
class RegionService {
    constructor() {
        this.regisionRepository = data_source_js_1.AppDataSource.getRepository(regions_js_1.Region);
    }
    /**
     * Retrieves all regions from the database, including their associated districts.
     *
     * @returns {Promise<Region[]>} A promise that resolves to an array of Region objects.
     */
    async getAllRegion() {
        return await this.regisionRepository.find({
            relations: ["districts", "districts.lignes", "districts.arrets"]
        });
    }
    /**
     * Retrieves a region by its ID, including its associated districts.
     *
     * @param {number} id The ID of the region to retrieve.
     * @returns {Promise<Region | null>} A promise that resolves to the retrieved Region object, or null if no region is found.
     */
    async getRegionById(id) {
        return this.regisionRepository.findOne({ where: { id }, relations: ["districts", "districts.lignes", "districts.arrets"] });
    }
    /**
     * Creates a new region and persists it to the database.
     * If a provinceId is provided in the data, it will be used to create a
     * Province object and associate it with the region.
     *
     * @param {Partial<Region> & { province_id?: number }} data The data of the region to create.
     * @returns {Promise<Region>} A promise that resolves to the created Region object.
     */
    async createRegion(data) {
        if (data.province_id) {
            data.province = { id: data.province_id };
            delete data.province_id;
        }
        const region = this.regisionRepository.create(data);
        return await this.regisionRepository.save(region);
    }
    /**
     * Deletes a region by its ID.
     *
     * @param {number} id The ID of the region to delete.
     * @returns {Promise<void>} A promise that resolves when the region has been deleted.
     */
    async removeRegion(id) {
        return this.regisionRepository.delete(id);
    }
}
exports.RegionService = RegionService;
//# sourceMappingURL=region.sevice.js.map