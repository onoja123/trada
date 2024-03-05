import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    public oldPassword: string;

    @IsString()
    @IsNotEmpty()
    public newPassword: string;
}

export class SetupAddressDto {
    @IsString()
    @IsOptional()
    public country?: string;

    @IsString()
    @IsOptional()
    public state?: string;

    @IsString()
    @IsOptional()
    public apartment?: string;

    @IsString()
    @IsOptional()
    public street?: string;

    @IsString()
    @IsOptional()
    public city?: string;

    @IsString()
    @IsOptional()
    public postalCode?: string;
}

export class setUpAccountDto {
    @IsString()
    @IsOptional()
    public firstname: string;

    @IsString()
    @IsOptional()
    public lastname: string;

    @IsString()
    @IsOptional()
    public username: string;

    @IsString()
    @IsOptional()
    public dateOfBirth: Date;

    @IsString()
    @IsOptional()
    public email: string;

    @IsString()
    @IsOptional()
    public gender: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}