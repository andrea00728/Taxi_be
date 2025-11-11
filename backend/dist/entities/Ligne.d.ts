import "reflect-metadata";
import { Arret } from "./Arret.js";
import { Itineraire } from "./Itineraire.js";
import { District } from "./districts.js";
export declare enum StatutLigne {
    Attent = "Attent",
    Accepted = "Accepted"
}
export declare class Ligne {
    id: number;
    nom: string;
    tarif: number;
    depart: string;
    terminus: string;
    arrets: Arret[];
    itineraires: Itineraire[];
    district: District;
    statut: StatutLigne;
    firebase_uid: string;
}
//# sourceMappingURL=Ligne.d.ts.map