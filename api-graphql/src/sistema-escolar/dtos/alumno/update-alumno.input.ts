import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateAlumnoInput} from './create-alumno.input';

@InputType()
export class UpdateAlumnoInput extends PartialType(CreateAlumnoInput) {
  @Field(() => ID)
  @IsNumber()
  id_alumno: number;
}
