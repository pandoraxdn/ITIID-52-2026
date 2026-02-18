import {IsString, IsNumber, MinLength, MaxLength, IsOptional} from "class-validator";

export class UpdateTareaDto {
  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @IsOptional()
  nombre: string;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @IsOptional()
  materia: string;

  @IsString()
  @MaxLength(255)
  @MinLength(5)
  @IsOptional()
  fecha: string;

  @IsNumber()
  @IsOptional()
  prioridad: number;
}
