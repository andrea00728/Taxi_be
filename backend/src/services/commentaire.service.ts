import { AppDataSource } from "../config/data-source";
import { CreateCommentaireDto } from "../dtos/create-commentaire.dto";
import { Commentaire } from "../entities/commentaire";
import { Ligne } from "../entities/Ligne";

export class CommentaireService{
    private commentaireRepo= AppDataSource.getRepository(Commentaire);


    async createCommentaire(data:Partial<Commentaire> &{ligne_id?:number},firebaseUid:string){
        
        if(data.ligne_id){
            data.ligne ={id:data.ligne_id} as Ligne;
            delete data.ligne_id;
        }

        const coms= this.commentaireRepo.create({
            ...data,
            firebase_uid:firebaseUid,
        });

        const saveCommentaire = await this.commentaireRepo.save(coms);

        return saveCommentaire;
    }

    async getAllComs(){
        return await this.commentaireRepo.find()
    }

    async getComsByLigne(ligne_id:number){
        const comsLigne=await this.commentaireRepo.find(
            {where:{ligne:{id:ligne_id}}},
        )

        return comsLigne;
    }

   async removeComs(id: number, userUid: string, userRole: string) {
    try {
        const commentaire = await this.commentaireRepo.findOneBy({ id });

        if (!commentaire) {
            throw new Error(`Commentaire avec l'id ${id} est introuvable`);
        }

        // ✅ Vérifier que l'utilisateur est le créateur OU admin
        if (commentaire.firebase_uid !== userUid && userRole !== 'admin') {
            throw new Error('Vous n\'êtes pas autorisé à supprimer ce commentaire');
        }

        const removedCommentaire = await this.commentaireRepo.delete({ id });
        return removedCommentaire;
    } catch (error) {
        console.error(`Erreur lors de la suppression du commentaire avec l'id #${id}`);
        throw error;
    }
}


}