import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Relation, Index } from "typeorm";
import { Ligne } from "./Ligne.js"; // juste pour TypeScript
import { District } from "./districts.js";
import { Region } from "./regions.js";

@Entity()
export class Arret {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column("decimal", { precision: 10, scale: 6 })
  latitude!: number;

  @Column("decimal", { precision: 10, scale: 6 })
  longitude!: number;

  
    @ManyToOne('Ligne','arrets',{onDelete:"CASCADE"})
  ligne!:Ligne;

  
  @ManyToOne('District','arrets',{onDelete:"CASCADE"})
  districts!:District;

  @Column()
  @Index()
  firebase_uid!:string

}
