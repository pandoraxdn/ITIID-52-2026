import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsBoolean, IsDateString, IsNotEmpty, IsString} from 'class-validator';

@InputType()
export class CreateCicloEscolarInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: Date;

  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha_fin: Date;

  @Field(() => String)
  @IsBoolean()
  @IsNotEmpty()
  activo: boolean;
}
