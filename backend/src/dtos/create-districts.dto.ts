import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import "reflect-metadata";

export class CreateDistrictsDto {

    @IsString()
    @IsNotEmpty()
    nom!:string;

    @IsNumber()
    region_id?:number;
}