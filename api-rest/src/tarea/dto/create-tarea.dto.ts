import {IsString, IsNumber, MinLength, MaxLength} from "class-validator";

export class CreateTareaDto {
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  nombre: string;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  materia: string;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  fecha: string;

  @IsNumber()
  prioridad: number;
}
