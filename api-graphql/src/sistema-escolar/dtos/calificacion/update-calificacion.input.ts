import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateCalificacionInput} from './create-calificacion.input';

@InputType()
export class UpdateCalificacionInput extends PartialType(CreateCalificacionInput) {
  @Field(() => ID)
  @IsNumber()
  id_calificacion: number;
}
