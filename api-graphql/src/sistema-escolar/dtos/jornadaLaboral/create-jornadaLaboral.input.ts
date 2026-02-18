import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';

@InputType()
export class CreateJornadaLaboralInput {
  @Field(() => Int)
  @IsNumber()
  empleado_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  dia_semana: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  horaEntrada: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  horaSalida: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  tolerancia_minutos: number;
}
