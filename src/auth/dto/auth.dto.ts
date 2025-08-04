import { Role } from "@prisma/client";
import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role = Role.USER; // Optional role with default
}

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}