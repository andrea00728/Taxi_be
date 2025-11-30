"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentaireService = void 0;
const data_source_1 = require("../config/data-source");
const commentaire_1 = require("../entities/commentaire");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class CommentaireService {
    constructor() {
        this.commentaireRepo = data_source_1.AppDataSource.getRepository(commentaire_1.Commentaire);
    }
    /**
  * Enrichir les commentaires avec les infos Firebase
  */
    async enrichCommentsWithUserInfo(comments) {
        const enrichedComments = await Promise.all(comments.map(async (comment) => {
            try {
                //  Récupérer l'utilisateur depuis Firebase
                const firebaseUser = await firebase_admin_1.default.auth().getUser(comment.firebase_uid);
                return {
                    ...comment,
                    user: {
                        displayName: firebaseUser.displayName || 'Utilisateur',
                        email: firebaseUser.email,
                        photoURL: firebaseUser.photoURL,
                    }
                };
            }
            catch (error) {
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
        }));
        return enrichedComments;
    }
    async findComsRecent(ligne_id) {
        const coms = await this.commentaireRepo.findOne({
            where: { ligne: { id: ligne_id } },
            order: { createdAt: 'DESC' },
        });
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
        return await this.enrichCommentsWithUserInfo(comsLigne);
    }
    async removeComs(id, userUid, userRole) {
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
        }
        catch (error) {
            console.error(`Erreur lors de la suppression du commentaire avec l'id #${id}`);
            throw error;
        }
    }
}
exports.CommentaireService = CommentaireService;
//# sourceMappingURL=commentaire.service.js.map