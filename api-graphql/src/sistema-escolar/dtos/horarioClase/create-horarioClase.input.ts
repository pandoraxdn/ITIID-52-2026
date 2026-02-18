import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsDateString, IsNotEmpty, IsNumber, IsString} from 'class-validator';

@InputType()
export class CreateHorarioClaseInput {
  @Field(() => Int)
  @IsNumber()
  det_grupo_materia_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  dia_semana: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  hora_inicio: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  hora_fin: Date;
}
