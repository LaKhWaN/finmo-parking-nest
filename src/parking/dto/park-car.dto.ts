import { IsNotEmpty, IsString } from "class-validator";

export class ParkCarDto {
    
    @IsString()
    @IsNotEmpty()
    registrationNumber: string;

    @IsString()
    @IsNotEmpty()
    color: string;
}