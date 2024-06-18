import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsStrongPassword } from 'class-validator';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;

    firstName?: string;

    lastName?: string;
}

export class tokenDto {
    userId: number;
    email: string;
}