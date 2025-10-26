import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import "reflect-metadata";

export class CreateLigneDto{

    @IsString()
    @IsNotEmpty()
    nom!:string;

    @IsNumber()
    tarif!:number;

    @IsString()
    depart!:string;

    @IsString()
    terminus!:string;

    @IsNumber()
    district_id?:number;
}