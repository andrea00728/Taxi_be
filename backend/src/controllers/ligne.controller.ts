import { StatutLigne } from "../entities/Ligne.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { LigneService } from "../services/ligne.service.js";
import { Request, Response } from "express";
const ligneService= new LigneService();
export class LigneController {
/**
 * Retrieves all lignes from the database, including their associated arrets and itineraires.
 *
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while retrieving the lignes.
 */
   static async getAllLignes(req: Request, res: Response) {
  try {
      const data = await ligneService.getAllLignes();
      res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des lignes"});
  }
}



/**
 * Retrieves all lignes belonging to a given user, including their associated arrets and itineraires.
 *
 * @param {AuthRequest} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while retrieving the lignes.
 */
static async getLigneByUser(req:AuthRequest,res:Response){
  try {
     const firebaseUid=req.user!.uid;
     const data = await ligneService.getLigneUser(firebaseUid);
     res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des lignes" });
  }

}



/**
 * Retrieves a ligne by its ID, including its associated arrets and itineraires.
 *
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while retrieving the ligne.
 */
static async getLigneById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const data = await ligneService.getLigneById(id);
    if (!data) {
      return res.status(404).json({ message: "Ligne introuvable" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la ligne" });
  }
}




/**
 * Creates a new ligne and persists it to the database.
 *
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while creating the ligne.
 */
static async createLigne(req:AuthRequest,res:Response){
    try {
    const payload=req.body;
     const firebaseUid=req.user!.uid;
      const role = req.user!.role;
    const createLigne=await ligneService.createLign(payload,firebaseUid,role);
    res.status(201).json({message:"ligne crée avec succès",createLigne});
    } catch (error) {
      console.log(error);
       res.status(500).json({ message: "Erreur lors de la création de la ligne",error }); 
    }
}





/**
 * Updates a ligne by its ID.
 *
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while updating the ligne.
 */
static async updateLigne(req:Request,res:Response){
    try {
    const id=Number(req.params.id);
    const updateLigne= await ligneService.updateLigne(id,req.body);
    res.status(200).json({message:"ligne mise à jour avec succès",updateLigne});
    } catch (error) {
       res.status(500).json({ message: "Erreur lors de la mise à jour de la ligne" }); 
    }
}





/**
 * Met à jour le statut d'une ligne par son ID.
 * 
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while updating the ligne.
 */
static async updateStatusLigne(req:Request,res:Response){
    try {
    const id=Number(req.params.id);
    const updateLigne= await ligneService.updateStatusLigne(id,req.body);
    res.status(200).json({message:"ligne mise à jour avec succès",updateLigne});
    } catch (error) {
       res.status(500).json({ message: "Erreur lors de la mise à jour de la ligne" }); 
    }
}

/**
 * Deletes a ligne by its ID.
 *
 * @param {Request} req The Express request object.
 * @param {Response} res The Express response object.
 * @returns {Promise<void>} A promise that resolves when the response has been sent.
 * @throws {Error} If an error occurs while deleting the ligne.
 */
static async deleteLigne(req:Request,res:Response){
    try {
    const id=Number(req.params.id);
    await ligneService.deleteLigne(id);
    res.status(200).json({ message: "Ligne supprimée avec succès" });
    } catch (error) {
       res.status(500).json({ message: "Erreur lors de la suppression de la ligne" }); 
    }
}



}