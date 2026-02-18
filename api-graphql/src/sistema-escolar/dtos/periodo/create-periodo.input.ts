import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsDateString, IsNotEmpty, IsNumber, IsString} from 'class-validator';

@InputType()
export class CreatePeriodoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_fin: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_limite_captura: Date;

  @Field(() => Int)
  @IsNumber()
  ciclo_id: number;
}
