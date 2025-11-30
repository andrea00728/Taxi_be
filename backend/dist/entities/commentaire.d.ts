import { Ligne } from "./Ligne";
export declare enum SatisfactionLevel {
    Decevant = "decevant",
    Moyen = "moyen",
    Excellent = "excellent"
}
export declare class Commentaire {
    id: number;
    contenu: string;
    satisfaction: SatisfactionLevel;
    firebase_uid: string;
    ligne: Ligne;
    createdAt: Date;
}
//# sourceMappingURL=commentaire.d.ts.map