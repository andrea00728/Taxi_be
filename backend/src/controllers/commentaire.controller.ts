import { AuthRequest } from "../middlewares/authMiddleware";
import { CommentaireService } from "../services/commentaire.service";
import { Request, Response } from "express";
const comsService=new CommentaireService();
export class CommentaireController{


    static async getAll_Coms(req:Request,res:Response){
        try {
            const data= await comsService.getAllComs();
            res.status(200).json(data);
        } catch (error) {
            console.log("Erreur lors de la recuperation des commentaire",error)
            res.status(500).json({message:"Erreur lors de la recuperation des commentaire"});
            throw new Error("Erreur lors de la recuperation des commentaire");
        }
    }

    static async getAll_comsBy_Ligne(req:Request,res:Response){
        try {
            const ligne_id= Number(req.params.id);
            const data =    await   comsService.getComsByLigne(ligne_id);
            res.status(200).json(data);
        } catch (error) {
            console.log(`erreur lors de la recuperation deu commentaire  `,error);
            res.status(500).json({message:`erreur lors de la recuperation du commentaire `});
            throw new Error(`erreur lors de la recuperation deu commentaire  `);
        }
    }

    static async create_Coms(req:AuthRequest,res:Response){
        try {
            const payload=req.body;
            const firebaseUid=req.user!.uid;
            const create_coms= await comsService.createCommentaire(payload,firebaseUid);

            res.status(201).json(create_coms)
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"Erreur lors de la creation du commentaire"});
            throw new Error("Erreur lors de la creation du commentaire")
        }
    }

 static async deleteCOoms(req: AuthRequest, res: Response) {
    try {
        const id = Number(req.params.id);
        const userUid = req.user!.uid;
        const userRole = req.user!.role;

        await comsService.removeComs(id, userUid, userRole);
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error: any) {
        console.error("Erreur suppression:", error);
        
        if (error.message === 'Vous n\'êtes pas autorisé à supprimer ce commentaire') {
            res.status(403).json({ message: error.message });
        } else if (error.message.includes('introuvable')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Erreur lors de la suppression du commentaire" });
        }
    }
}

}