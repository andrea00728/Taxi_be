import { AppDataSource } from "../config/data-source";
import { NotificationEntity } from "../entities/notification";
import { notificationGateway } from "../server";



export class NotificationService{
    private notificationRepo = AppDataSource.getRepository(NotificationEntity);
    private geteway = notificationGateway;


    async notifyAll (title:string,message:string,type: 'info' | 'success' | 'error' | 'warning' = 'info'){
        this.geteway.emitNotifRegisterToAdmin({
            title,
            message,
            type,
            date:new Date().toISOString(),
        });
    }


    async notifAll__ (title:string,message:string,type:'info'|'success'|'error'|'warning'='info'){
        const notif= this.notificationRepo.create({
            title,
            message,
            type,
        });

        const saveNotif= await this.notificationRepo.save(notif);
        this.geteway.emitNotifRegisterToAdmin({
            title:saveNotif.title,
            message:saveNotif.message,
            type:saveNotif.type,
            date:saveNotif.date.toISOString(),
        })
    }



    async findAllNotif():Promise<NotificationEntity[]>{
         const response= this.notificationRepo.find({
            order:{date:'DESC'},
         });
         return response;
    }


        async removeNotification(id: number) {
        try {
            const notif = await this.notificationRepo.findOneBy({ id });

            if (!notif) {
                throw new Error(`Notification #${id} introuvable`);
            }
            const result = await this.notificationRepo.delete({ id });
            return result;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la notif ${id}:`, error);
            throw error; 
        }
    }

    async markAsRead(id: number) {
    return await this.notificationRepo.update({ id }, { isRead: true });
}



}