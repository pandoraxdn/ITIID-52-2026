import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateDetGrupoMateriaInput} from './create-detGrupoMateria.input';

@InputType()
export class UpdateDetGrupoMateriaInput extends PartialType(CreateDetGrupoMateriaInput) {
  @Field(() => ID)
  @IsNumber()
  id_det_grupo_materia: number;
}
