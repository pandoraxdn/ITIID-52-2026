import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateAsistenciaAlumnoInput} from './create-asistenciaAlumno.input';

@InputType()
export class UpdateAsistenciaAlumnoInput extends PartialType(CreateAsistenciaAlumnoInput) {
  @Field(() => ID)
  @IsNumber()
  id_asistencia_al: number;
}
