import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateJustificanteEmpleadoInput} from './create-justificanteEmpleado.input';

@InputType()
export class UpdateJustificanteEmpleadoInput extends PartialType(CreateJustificanteEmpleadoInput) {
  @Field(() => ID)
  @IsNumber()
  id_justificante: number;
}
