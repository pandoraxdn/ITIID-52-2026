import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';

@InputType()
export class CreateMenuComedorInput {
  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  alergenos: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  costo: number;

  @Field(() => Int)
  @IsNumber()
  ciclo_id: number;
}
