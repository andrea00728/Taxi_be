import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import "reflect-metadata";
export class CreateRegionsDto {
    
    @IsString()
    @IsNotEmpty()
    nom!:string;

    @IsNumber()
    province_id?:number;
}