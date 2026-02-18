import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';
import {TipoConsumo} from 'src/sistema-escolar/entities/consumos-comedor/consumo-comedor.entity';

@InputType()
export class CreateConsumoComedorInput {
  @Field(() => Int)
  @IsNumber()
  alumno_id: number;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @Field(() => String)
  @IsEnum(TipoConsumo)
  @IsNotEmpty()
  tipo_consumo: TipoConsumo;

  @Field(() => Int)
  @IsNumber()
  menu_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  observaciones: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  reporte_incidencia: string;
}
