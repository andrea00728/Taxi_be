import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import "reflect-metadata";

export class CreateArretDto{
    @IsString()
    @IsNotEmpty()
    nom!:string;
    
    @IsNumber()
    latitude!:number;

    
    @IsNumber()
    longitude!:number;

    // @IsNumber()
    //  ligneId?: number;

    nomligne!:string;
}