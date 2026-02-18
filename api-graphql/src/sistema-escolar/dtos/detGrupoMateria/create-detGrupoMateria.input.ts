import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

@InputType()
export class CreateDetGrupoMateriaInput {
  @Field(() => Int)
  @IsNumber()
  grupo_id: number;

  @Field(() => Int)
  @IsNumber()
  materia_id: number;

  @Field(() => Int)
  @IsNumber()
  profesor_id: number;

  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  salon_asignado?: string;
}
