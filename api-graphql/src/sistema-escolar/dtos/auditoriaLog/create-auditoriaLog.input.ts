import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsDateString, IsNotEmpty, IsNumber, IsString} from 'class-validator';

@InputType()
export class CreateAuditoriaLogInput {
  @Field(() => Int)
  @IsNumber()
  usuario_id: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  accion: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  tabla_afectada: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  valor_anterior: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  valor_nuevo: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ip: string;
}
