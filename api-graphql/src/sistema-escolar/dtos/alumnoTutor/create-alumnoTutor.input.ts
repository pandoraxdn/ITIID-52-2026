import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsBoolean, IsInt, IsNotEmpty} from 'class-validator';

@InputType()
export class CreateAlumnoTutorInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  alumno_id: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  tutor_id: number;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  es_tutor_financiero: boolean;
}
