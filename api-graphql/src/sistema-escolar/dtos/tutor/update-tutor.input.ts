import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateTutorInput} from './create-tutor.input';

@InputType()
export class UpdateTutorInput extends PartialType(CreateTutorInput) {
  @Field(() => ID)
  @IsNumber()
  id_tutor: number;
}
