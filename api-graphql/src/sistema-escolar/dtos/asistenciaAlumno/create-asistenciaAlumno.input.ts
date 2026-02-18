import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';
import {EstadoAsistenciaAl} from 'src/sistema-escolar/entities/asistencias-alumnos/asistencia-alumnos.entity';

@InputType()
export class CreateAsistenciaAlumnoInput {
  @Field(() => Int)
  @IsNumber()
  inscripcion_id: number;

  @Field(() => Int)
  @IsNumber()
  det_grupo_materia_id: number;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @Field(() => EstadoAsistenciaAl)
  @IsEnum(EstadoAsistenciaAl)
  @IsNotEmpty()
  estado_asistencia: EstadoAsistenciaAl;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  observaciones: string;
}
