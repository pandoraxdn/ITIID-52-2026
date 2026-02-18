import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateConsumoComedorInput} from './create-consumoComedor.input';

@InputType()
export class UpdateConsumoComedorInput extends PartialType(CreateConsumoComedorInput) {
  @Field(() => ID)
  @IsNumber()
  id_consumo: number;
}
