import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateCicloEscolarInput} from './create-cicloEscolar.input';

@InputType()
export class UpdateCicloEscolarInput extends PartialType(CreateCicloEscolarInput) {
  @Field(() => ID)
  @IsNumber()
  id_ciclo: number;
}
