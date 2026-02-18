import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsPositive, IsString} from 'class-validator';

@InputType()
export class CreateCalificacionInput {
  @Field(() => Int)
  @IsNumber()
  inscripcion_id: number;

  @Field(() => Int)
  @IsNumber()
  det_grupo_materia_id: number;

  @Field(() => Int)
  @IsNumber()
  periodo_id: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  valor: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  faltas_periodo: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  observaciones: string;
}
