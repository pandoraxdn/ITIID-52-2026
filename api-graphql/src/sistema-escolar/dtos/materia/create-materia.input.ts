import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';
import {TipoMateria} from 'src/sistema-escolar/entities/materias/materia.entity';

@InputType()
export class CreateMateriaInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  clave_oficial: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  creditos: number;

  @Field(() => String)
  @IsEnum(TipoMateria)
  @IsNotEmpty()
  tipo: TipoMateria;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
