import { Commentaire } from "../entities/commentaire";
export declare class CommentaireService {
    private commentaireRepo;
    createCommentaire(data: Partial<Commentaire> & {
        ligne_id?: number;
    }, firebaseUid: string): Promise<Commentaire>;
    getAllComs(): Promise<Commentaire[]>;
    getComsByLigne(ligne_id: number): Promise<Commentaire[]>;
    removeComs(id: number, userUid: string, userRole: string): Promise<import("typeorm").DeleteResult>;
}
//# sourceMappingURL=commentaire.service.d.ts.map