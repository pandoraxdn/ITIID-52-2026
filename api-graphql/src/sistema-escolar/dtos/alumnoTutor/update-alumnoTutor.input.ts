import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateAlumnoTutorInput} from './create-alumnoTutor.input';

@InputType()
export class UpdateAlumnoTutorInput extends PartialType(CreateAlumnoTutorInput) {
  @Field(() => ID)
  @IsNumber()
  id_de_al_tutor: number;
}
