import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateGrupoInput} from './create-grupo.input';

@InputType()
export class UpdateGrupoInput extends PartialType(CreateGrupoInput) {
  @Field(() => ID)
  @IsNumber()
  id_grupo: number;
}
