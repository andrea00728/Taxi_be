import { NotificationService } from "../services/notification.service";
import { Request, Response } from "express";

const notificationService = new NotificationService();

export  class NotificationController{
    static async findAllNotification(req:Request,res:Response){
        try {
            const result= await  notificationService.findAllNotif();
            res.status(200).json(result);
            
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message:"Erreur lors de la récupération des lignes"})
        }
    }


    static async removeNotification(req:Request,res:Response){
        try {
            const id = Number(req.params.id);
            await notificationService.removeNotification(id);
            res.status(200).json({message:"notification supprimer avec success"})
        } catch (error) {
            res.status(500).json({message:"Erreur lors de la suppression de la notification"})
        }
    }

    
static async markRead(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await notificationService.markAsRead(id);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ message: "Erreur serveur" });
    }
}

}
