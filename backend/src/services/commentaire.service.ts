import { AppDataSource } from "../config/data-source";
import { CreateCommentaireDto } from "../dtos/create-commentaire.dto";
import { Commentaire } from "../entities/commentaire";
import { Ligne } from "../entities/Ligne";
import admin from "firebase-admin";
export class CommentaireService{
    private commentaireRepo= AppDataSource.getRepository(Commentaire);


     /**
   * Enrichir les commentaires avec les infos Firebase
   */
  private async enrichCommentsWithUserInfo(comments: Commentaire[]) {
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        try {
          //  Récupérer l'utilisateur depuis Firebase
          const firebaseUser = await admin.auth().getUser(comment.firebase_uid);
          return {
            ...comment,
            user: {
              displayName: firebaseUser.displayName || 'Utilisateur',
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            }
          };
        } catch (error) {
          console.error(`Erreur récupération user ${comment.firebase_uid}:`, error);
          // Fallback si l'utilisateur n'existe plus dans Firebase
          return {
            ...comment,
            user: {
              displayName: 'Utilisateur',
              email: null,
              photoURL: null,
            }
          };
        }
      })
    );

    return enrichedComments;
  }
    async findComsRecent(ligne_id:number){
        const coms=await this.commentaireRepo.findOne({
            where:{ligne:{id:ligne_id}},
            order:{createdAt:'DESC'},
        })
    }
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

        return await this.enrichCommentsWithUserInfo(comsLigne);
    }

   async removeComs(id: number, userUid: string, userRole: string) {
    try {
        const commentaire = await this.commentaireRepo.findOneBy({ id });

        if (!commentaire) {
            throw new Error(`Commentaire avec l'id ${id} est introuvable`);
        }

        //  Vérifier que l'utilisateur est le créateur OU admin
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