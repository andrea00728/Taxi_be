import { AuthRequest } from "../middlewares/authMiddleware.js";
import { ArretService } from "../services/arret.service.js";
import { Request, Response } from "express";

const arretService= new ArretService();

export class ArretController {
    /**
     * Retrieves all arrets from the database, including their associated lignes.
     *
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the arrets.
     */

    static async getAllArret(req:Request,res:Response) {
        try {
             const data =await arretService.getAllArrets();
        res.json(data); 
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la récupération des arrets"});
        }
    }



    /**
     * Retrieves all arrets belonging to a given user, including their associated lignes.
     * 
     * @param {AuthRequest} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the arrets.
     */
    static async getArretByUser(req:AuthRequest,res:Response){
        try {
            const firebaseUid=req.user!.uid;
            const data=await arretService.getArretByUser(firebaseUid);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la récupération des arrets"});
        }
    }




    
    /**
     * Retrieves an arret by its ID, including its associated ligne.
     * 
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while retrieving the arret.
     */
    static async getArretById(req:Request,res:Response){
        try {
            const id=Number(req.params.id);
            const data= await arretService.getArretById(id);
            if(!data){
                return res.status(404).json({message:"arret introuvable"});
            }
            res.json(data);
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la récupération de l'arret"});
        }
    }




    
    /**
     * Creates a new arret and persists it to the database.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while creating the arret.
     */
    static async createArret(req:AuthRequest,res:Response){
        try {
            const payload=req.body;
            const firebaseUid=req.user!.uid;
            const createArret=await arretService.createArret(payload,firebaseUid);
            res.status(201).json({message:"arret crée avec succès",createArret});
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la création de l'arret"});
        }
    }





    /**
     * Updates an arret by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while updating the arret.
     */
    static async updateArret(req:Request,res:Response){
        try {
            const id= Number(req.params.id);
            const updateArret=await arretService.updateArret(id,req.body);
            res.status(200).json({message:"arret mise à jour avec succès",updateArret});
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la mise à jour de l'arret"});
        }
    }

    /**
     * Deletes an arret by its ID.
     *
     * @param {Request} req The Express request object.
     * @param {Response} res The Express response object.
     * @returns {Promise<void>} A promise that resolves when the response has been sent.
     * @throws {Error} If an error occurs while deleting the arret.
     */
    static async RemoveArret(req:Request,res:Response){
        try {
            const id=Number(req.params.id);
            await arretService.deleteArret(id);
            res.status(200).json({message:"arret supprimée avec succès"});
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la suppression de l'arret"});
        }
    }






     /**
   * Recherche d'arrêts pour l'autocomplétion
   */
  static async search(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || "";
      const limit = parseInt(req.query.limit as string) || 5;

      // Si moins de 2 caractères, retourner liste vide
      if (!query || query.trim().length < 2) {
        return res.status(200).json({
          arrets: [],
          count: 0,
        });
      }

      // Utiliser la méthode existante findByName
      const arrets = await arretService.findByName(query.trim());

      // Limiter les résultats
      const limitedArrets = arrets.slice(0, limit);

      return res.status(200).json({
        arrets: limitedArrets,
        count: limitedArrets.length,
        query: query.trim(),
      });
    } catch (error: any) {
      console.error("Erreur recherche arrêts:", error);
      return res.status(500).json({
        message: "Erreur lors de la recherche",
        error: error.message,
        arrets: [],
      });
    }
  }
}