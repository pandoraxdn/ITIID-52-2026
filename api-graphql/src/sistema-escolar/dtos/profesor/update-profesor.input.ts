import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateProfesorInput} from './create-profesor.input';

@InputType()
export class UpdateProfesorInput extends PartialType(CreateProfesorInput) {
  @Field(() => ID)
  @IsNumber()
  id_profesor: number;
}
