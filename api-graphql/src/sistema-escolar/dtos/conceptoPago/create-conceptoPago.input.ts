import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';

@InputType()
export class CreateConceptoPagoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  monto: number;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  es_recurrente: boolean;
}
