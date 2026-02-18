import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateMateriaInput} from './create-materia.input';

@InputType()
export class UpdateMateriaInput extends PartialType(CreateMateriaInput) {
  @Field(() => ID)
  @IsNumber()
  id_materia: number;
}
