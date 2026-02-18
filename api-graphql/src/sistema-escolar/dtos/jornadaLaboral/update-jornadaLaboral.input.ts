import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateJornadaLaboralInput} from './create-jornadaLaboral.input';

@InputType()
export class UpdateJornadaLaboralInput extends PartialType(CreateJornadaLaboralInput) {
  @Field(() => ID)
  @IsNumber()
  id_jornada: number;
}
