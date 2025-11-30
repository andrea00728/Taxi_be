import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SatisfactionLevel } from "../entities/commentaire";

export class CreateCommentaireDto{

    @IsString()
    @IsNotEmpty()
    contenu!:string;

    @IsEnum(SatisfactionLevel)
    satisfaction!:SatisfactionLevel;

    @IsNumber()
    ligne_id?:number;
}