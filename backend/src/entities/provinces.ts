import "reflect-metadata";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./regions.js";

@Entity()
export class Province {
   @PrimaryGeneratedColumn()
     id!: number;
   
     @Column({ unique: true })
     nom!: string;

      @OneToMany(() => Region, (region) => region.province)
       regions!: Region[];
}