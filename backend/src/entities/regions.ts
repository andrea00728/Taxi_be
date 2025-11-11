import "reflect-metadata";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Province } from "./provinces.js";
import { District } from "./districts.js";
import { Arret } from "./Arret.js";
import { Ligne } from "./Ligne.js";

@Entity()
export class Region{
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({unique:true})
    nom!: string;

    @ManyToOne(() => Province, (province) => province.regions, { onDelete: "CASCADE" })
     @JoinColumn({ name: "province_id" })
    province!: Province;

    @OneToMany(() => District, (district) => district.region)
    districts!: District[];

}