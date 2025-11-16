import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ligne } from "./Ligne.js";
import "reflect-metadata";

@Entity()
export class Itineraire {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  depart!: string;

  @Column()
  destination!: string;

  @Column("decimal")
  distance!: number;

  @Column("decimal")
  duree!: number;

  @Column("decimal")
  tarif!: number;

  @ManyToOne(() => Ligne, (ligne) => ligne.itineraires, { onDelete: "CASCADE" })
  ligne!: Ligne;
}
