import { Commentaire } from "../entities/commentaire";
import { Ligne } from "../entities/Ligne";
export declare class CommentaireService {
    private commentaireRepo;
    /**
  * Enrichir les commentaires avec les infos Firebase
  */
    private enrichCommentsWithUserInfo;
    findComsRecent(ligne_id: number): Promise<void>;
    createCommentaire(data: Partial<Commentaire> & {
        ligne_id?: number;
    }, firebaseUid: string): Promise<Commentaire>;
    getAllComs(): Promise<Commentaire[]>;
    getComsByLigne(ligne_id: number): Promise<({
        user: {
            displayName: string;
            email: string | undefined;
            photoURL: string | undefined;
        };
        id: number;
        contenu: string;
        satisfaction: import("../entities/commentaire").SatisfactionLevel;
        firebase_uid: string;
        ligne: Ligne;
        createdAt: Date;
    } | {
        user: {
            displayName: string;
            email: null;
            photoURL: null;
        };
        id: number;
        contenu: string;
        satisfaction: import("../entities/commentaire").SatisfactionLevel;
        firebase_uid: string;
        ligne: Ligne;
        createdAt: Date;
    })[]>;
    removeComs(id: number, userUid: string, userRole: string): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=commentaire.service.d.ts.map