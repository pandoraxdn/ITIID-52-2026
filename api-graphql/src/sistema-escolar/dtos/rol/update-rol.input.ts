import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateRolInput} from './create-rol.input';

@InputType()
export class UpdateRolInput extends PartialType(CreateRolInput) {
  @Field(() => ID)
  @IsNumber()
  id_rol: number;
}
