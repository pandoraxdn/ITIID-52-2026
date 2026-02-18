import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {Empleado} from 'src/sistema-escolar/entities/empleados/empleado.entity';
import {DetGrupoMateria} from 'src/sistema-escolar/entities/det-grupos-materias/det-grupo-materia.entity';
import {TipoNivelEstudio} from 'src/sistema-escolar/entities/profesores/profesor.entity';

@InputType()
export class CreateProfesorInput {
  @Field(() => Int)
  @IsNumber()
  empleado_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @Field(() => String)
  @IsEnum(TipoNivelEstudio)
  @IsNotEmpty()
  nivel_estudios: TipoNivelEstudio;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  cedula_profesional: string;
}
