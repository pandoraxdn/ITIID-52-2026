import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateInscripcionInput} from './create-inscripcion.input';

@InputType()
export class UpdateInscripcionInput extends PartialType(CreateInscripcionInput) {
  @Field(() => ID)
  @IsNumber()
  id_inscripcion: number;
}
