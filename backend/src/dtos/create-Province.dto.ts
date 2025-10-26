import { IsNotEmpty, IsString } from "class-validator";
import "reflect-metadata";

export class CreateProvinceDto {
    @IsString()
    @IsNotEmpty()
    nom!:string;
}