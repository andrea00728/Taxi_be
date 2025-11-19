import { Request, Response } from "express";
import { DistrictService } from "../services/districts.service.js";
import { count } from "console";


const districtService = new DistrictService();

export class DistrictController{

    /**
     * Retrieves all districts from the database, including their associated lignes and arrets.
     * 
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the districts.
     */
    static async getAllDistrict(req:Request,res:Response){
        try {
            const data = await districtService.getAllDistricts();
            res.json(data);
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la récupération des districts"});
        }
    }

    /**
     * Retrieves a district by its ID, including its associated lignes and arrets.
     * 
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the district.
     */
    static async getDistrictById(req:Request,res:Response){
        try {
            const id = Number(req.params.id);
            const data =await districtService.getDistrictById(id);
            if(!data){
                res.status(404).json({message:"District introuvable"});
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la récupération du district"});
        }
    }


    /**
     * Creates a new district and persists it to the database.
     * 
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the district.
     */
    static async createDistrict(req:Request,res:Response){
        try {
            const payload = req.body;
            const createDistrict = await districtService.createDistrict(payload);
            res.status(201).json({message:"district crée avec succès",createDistrict});
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la création du district"});
        }
    }


    /**
     * Deletes a district by its ID.
     * 
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the district.
     */
    static async removeDistrict(req:Request,res:Response){
        try {
            const id = Number(req.params.id);
            await districtService.removeDistrict(id);
            res.status(200).json({message:"district supprimée avec succès"});
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la suppression du district"});
        }
    }


    /**
     * Retrieves the number of lignes associated with a district by its ID.
     * 
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the count.
     */
    static async ligneCountByDistrict(req:Request,res:Response){
        try {
            const id = Number(req.params.id);
            const count = await districtService.ligneCountByDistrict(id);
            res.json({count});
        } catch (error) {
            res.status(500).json({message:`Erreur lors de la recuperation du ${count}`})
        }
    }
}