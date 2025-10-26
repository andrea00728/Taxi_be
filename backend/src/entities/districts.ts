import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./regions.js";
import { Ligne } from "./Ligne.js";
import { Arret } from "./Arret.js";

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @ManyToOne(() => Region, (region) => region.districts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "region_id" })
  region!: Region;

  @OneToMany(() => Ligne, (ligne) => ligne.district)
  lignes!: Ligne[];

   @OneToMany('Arret','districts')
  arrets!: Arret[];
}
