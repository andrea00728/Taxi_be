import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ligne } from "./Ligne";

export enum SatisfactionLevel{
    Decevant='decevant',
    Moyen='moyen',
    Excellent='excellent',
}


@Entity()
export class Commentaire{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    contenu!:string;


    @Column({
        type:'enum',
        enum:SatisfactionLevel,
        default:SatisfactionLevel.Moyen,
    })
    satisfaction!:SatisfactionLevel;

    
    @Column()
    @Index()
    firebase_uid!:string;

    @ManyToOne(()=>Ligne,(ligne)=>ligne.commentaires,{onDelete:"CASCADE"})
    ligne!:Ligne;
}