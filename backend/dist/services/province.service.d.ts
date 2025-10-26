import "reflect-metadata";
import { Province } from "../entities/provinces.js";
export declare class ProvinceService {
    private provinceRepository;
    /**
     * Retrieves all provinces from the database, including their associated regions, districts and lignes.
     *
     * @returns {Promise<Province[]>} A promise that resolves to an array of Province objects.
     */
    getAllProvinces(): Promise<Province[]>;
    /**
     * Retrieves a province by its ID, including its associated regions, districts and lignes.
     *
     * @param {number} id The ID of the province to retrieve.
     * @returns {Promise<Province | null>} A promise that resolves to the retrieved Province object, or null if no province is found.
     */
    getProvinceById(id: number): Promise<Province | null>;
    /**
     * Creates a new province and persists it to the database.
     *
     * @param {Partial<Province>} data The data of the province to create.
     * @returns {Promise<Province>} A promise that resolves to the created Province object.
     */
    createProvince(data: Partial<Province>): Promise<Province>;
    /**
     * Deletes a province by its ID.
     *
     * @param {number} id The ID of the province to delete.
     * @returns {Promise<void>} A promise that resolves when the province has been deleted.
     */
    removeProvince(id: number): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=province.service.d.ts.map