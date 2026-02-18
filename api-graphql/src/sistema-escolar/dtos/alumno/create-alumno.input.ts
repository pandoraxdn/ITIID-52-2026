import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsBoolean, IsDateString, IsNotEmpty, IsString} from 'class-validator';

@InputType()
export class CreateAlumnoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  matricula: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_p: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_m: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  genero: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  curp: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email_institucional: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  tipo_sangre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  alergias: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  condiciones_medicas: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_ingreso: Date;

  @Field(() => String)
  @IsBoolean()
  @IsNotEmpty()
  activo: boolean;
}
