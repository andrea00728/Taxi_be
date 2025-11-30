"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentaireService = void 0;
const data_source_1 = require("../config/data-source");
const commentaire_1 = require("../entities/commentaire");
class CommentaireService {
    constructor() {
        this.commentaireRepo = data_source_1.AppDataSource.getRepository(commentaire_1.Commentaire);
    }
    async createCommentaire(data, firebaseUid) {
        if (data.ligne_id) {
            data.ligne = { id: data.ligne_id };
            delete data.ligne_id;
        }
        const coms = this.commentaireRepo.create({
            ...data,
            firebase_uid: firebaseUid,
        });
        const saveCommentaire = await this.commentaireRepo.save(coms);
        return saveCommentaire;
    }
    async getAllComs() {
        return await this.commentaireRepo.find();
    }
    async getComsByLigne(ligne_id) {
        const comsLigne = await this.commentaireRepo.find({ where: { ligne: { id: ligne_id } } });
        return comsLigne;
    }
    async removeComs(id, userUid, userRole) {
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
        }
        catch (error) {
            console.error(`Erreur lors de la suppression du commentaire avec l'id #${id}`);
            throw error;
        }
    }
}
exports.CommentaireService = CommentaireService;
//# sourceMappingURL=commentaire.service.js.map