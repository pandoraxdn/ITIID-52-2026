import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';
import {EstadoAsistenciaEm} from 'src/sistema-escolar/entities/asistencias-empleados/asistencia-empleado.entity';

@InputType()
export class CreateAsistenciaEmpleadoInput {
  @Field(() => Int)
  @IsNumber()
  empleado_id: number;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  hora_entrada_real: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  hora_salida_real: Date;

  @Field(() => String)
  @IsEnum(EstadoAsistenciaEm)
  @IsNotEmpty()
  estado_asistencia: EstadoAsistenciaEm;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  minutos_retardo: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  observaciones: string;
}
