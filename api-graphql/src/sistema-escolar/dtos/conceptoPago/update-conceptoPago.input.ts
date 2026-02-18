import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateConceptoPagoInput} from './create-conceptoPago.input';

@InputType()
export class UpdateConceptoPagoInput extends PartialType(CreateConceptoPagoInput) {
  @Field(() => ID)
  @IsNumber()
  id_concepto: number;
}
