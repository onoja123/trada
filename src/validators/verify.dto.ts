import { IsNotEmpty } from "class-validator";

export class InitiateBvnDto {
    @IsNotEmpty()
    bvn: string;
}