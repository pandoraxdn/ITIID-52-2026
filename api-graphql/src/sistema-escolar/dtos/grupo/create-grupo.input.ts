import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';
import {TipoTurno} from 'src/sistema-escolar/entities/grupos/grupo.entity';
import {TipoNivel} from 'src/sistema-escolar/entities/grupos/grupo.entity';

@InputType()
export class CreateGrupoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  grupo: string;

  @Field(() => String)
  @IsEnum(TipoTurno)
  @IsNotEmpty()
  turno: TipoTurno;

  @Field(() => String)
  @IsEnum(TipoNivel)
  @IsNotEmpty()
  nivel: TipoNivel;

  @Field(() => Int, {nullable: true})
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  cupo_maximo?: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  aula: string;

  @Field(() => Int)
  @IsNumber()
  ciclo_id: number;
}
