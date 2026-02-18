import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateHorarioClaseInput} from './create-horarioClase.input';

@InputType()
export class UpdateHorarioClaseInput extends PartialType(CreateHorarioClaseInput) {
  @Field(() => ID)
  @IsNumber()
  id_horario_clase: number;
}
