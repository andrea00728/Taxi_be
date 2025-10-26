import "reflect-metadata";
import { Region } from "./regions.js";
import { Ligne } from "./Ligne.js";
import { Arret } from "./Arret.js";
export declare class District {
    id: number;
    nom: string;
    region: Region;
    lignes: Ligne[];
    arrets: Arret[];
}
//# sourceMappingURL=districts.d.ts.map