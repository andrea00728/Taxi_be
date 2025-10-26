import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, Column,OneToMany, Relation, ManyToMany, ManyToOne} from "typeorm";
import { Arret } from "./Arret.js";
import { Itineraire } from "./Itineraire.js";
import { District } from "./districts.js";
import { Region } from "./regions.js";


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

  @OneToMany('Arret','ligne')
  arrets!: Arret[];

  @OneToMany('Itineraire','ligne')
  itineraires!:Itineraire[];

 @ManyToOne(() => District, (district) => district.lignes)
  district!: District;

}
