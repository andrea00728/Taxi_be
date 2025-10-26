import { isNumber, IsNumber, IsString } from "class-validator";
import "reflect-metadata";
export class CreateItineraireDto{
    
    @IsString()
    depart!:string;

    @IsString()
    destination!:string;

    @IsNumber()
    distance!:number;

    @IsNumber()
    duree!:number;

    @IsNumber()
    tarif!:number
}