import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateAsistenciaEmpleadoInput} from './create-asistenciaEmpleado.input';

@InputType()
export class UpdateAsistenciaEmpleadoInput extends PartialType(CreateAsistenciaEmpleadoInput) {
  @Field(() => ID)
  @IsNumber()
  id_asistencia_emp: number;
}
