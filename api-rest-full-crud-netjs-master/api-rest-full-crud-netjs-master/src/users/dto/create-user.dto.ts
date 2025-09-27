import { IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Pérez',
        minLength: 1,
        maxLength: 100
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@example.com',
        format: 'email'
    })
    @IsEmail()
    email: string;
}