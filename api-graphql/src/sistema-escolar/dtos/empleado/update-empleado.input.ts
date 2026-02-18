import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateEmpleadoInput} from './create-empleado.input';

@InputType()
export class UpdateEmpleadoInput extends PartialType(CreateEmpleadoInput) {
  @Field(() => ID)
  @IsNumber()
  id_empleado: number;
}
