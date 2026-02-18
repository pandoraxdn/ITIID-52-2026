import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreatePeriodoInput} from './create-periodo.input';

@InputType()
export class UpdatePeriodoInput extends PartialType(CreatePeriodoInput) {
  @Field(() => ID)
  @IsNumber()
  id_periodo: number;
}
