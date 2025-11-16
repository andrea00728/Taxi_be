import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, Column,OneToMany, Relation, ManyToMany, ManyToOne, Index} from "typeorm";
import { Arret } from "./Arret.js";
import { Itineraire } from "./Itineraire.js";
import { District } from "./districts.js";
import { Region } from "./regions.js";

 export enum StatutLigne {
   Attent= "Attent",
   Accepted = "Accepted",
}

@Entity()
export class Ligne {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column("decimal")
  tarif!: number;

  @Column()
  depart!: string;

  @Column()
  terminus!: string;

  @OneToMany('Arret','ligne',{onDelete:"CASCADE"})
  arrets!: Arret[];

  @OneToMany('Itineraire','ligne',{onDelete:"CASCADE"})
  itineraires!:Itineraire[];

 @ManyToOne(() => District, (district) => district.lignes, { onDelete: "CASCADE" })
  district!: District;

  @Column({ type: "enum", enum: StatutLigne, default: StatutLigne.Attent })
  statut!:StatutLigne;

  @Column()
  @Index()
  firebase_uid!:string;
}
