import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsDateString, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';

@InputType()
export class CreateInscripcionInput {
  @Field(() => Int)
  @IsNumber()
  alumno_id: number;

  @Field(() => Int)
  @IsNumber()
  grupo_id: number;

  @Field(() => Int)
  @IsNumber()
  ciclo_id: number;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_inscripcion: Date;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  beca_porcentaje: number;
}
