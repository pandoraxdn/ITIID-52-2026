import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

@InputType()
export class CreateUsuarioInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @Field(() => Int)
  @IsNumber()
  rol_id: number;

  @Field(() => Int, {nullable: true})
  @IsNumber()
  @IsOptional()
  empleado_id?: number;

  @Field(() => Int, {nullable: true})
  @IsNumber()
  @IsOptional()
  alumno_id?: number;

  @Field(() => Int, {nullable: true})
  @IsNumber()
  @IsOptional()
  tutor_id?: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  avatar_url: string;

  @Field(() => String)
  @IsDateString()
  @IsNotEmpty()
  ultimo_acceso: Date;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  activo: boolean;
}
