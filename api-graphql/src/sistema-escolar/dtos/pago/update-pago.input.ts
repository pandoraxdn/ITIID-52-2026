import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreatePagoInput} from './create-pago.input';

@InputType()
export class UpdatePagoInput extends PartialType(CreatePagoInput) {
  @Field(() => ID)
  @IsNumber()
  id_pago: number;
}
