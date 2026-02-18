import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString
} from 'class-validator';
import {TipoEmpleado} from 'src/sistema-escolar/entities/empleados/empleado.entity';
import {TipoPuesto} from 'src/sistema-escolar/entities/empleados/empleado.entity';

@InputType()
export class CreateEmpleadoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  numero_empleado: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_p: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_m: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email_personal: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email_institucional: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @Field(() => String)
  @IsEnum(TipoEmpleado)
  @IsNotEmpty()
  tipo_empleado: TipoEmpleado;

  @Field(() => String)
  @IsEnum(TipoPuesto)
  @IsNotEmpty()
  puesto: TipoPuesto;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  departamento: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_contratacion: Date;

  @Field(() => String)
  @IsBoolean()
  @IsNotEmpty()
  activo: boolean;
}
