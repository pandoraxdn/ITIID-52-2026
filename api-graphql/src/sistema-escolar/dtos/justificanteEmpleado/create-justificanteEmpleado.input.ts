import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {TipoJustificante} from 'src/sistema-escolar/entities/justificantes-empleados/justificante-empleado.entity';
import {EstadoAprobacion} from 'src/sistema-escolar/entities/justificantes-empleados/justificante-empleado.entity';

@InputType()
export class CreateJustificanteEmpleadoInput {
  @Field(() => Int)
  @IsNumber()
  empleado_id: number;

  @Field(() => String)
  @IsEnum(TipoJustificante)
  @IsNotEmpty()
  tipo_justificante: TipoJustificante;

  @Field(() => Date)
  @IsString()
  @IsNotEmpty()
  fecha_inicio: string;

  @Field(() => Date)
  @IsString()
  @IsNotEmpty()
  fecha_fin: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  motivo: string;

  @Field(() => String)
  @IsEnum(EstadoAprobacion)
  @IsNotEmpty()
  estado_aprobacion: EstadoAprobacion;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  documento_url: string;
}
