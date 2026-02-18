import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateAuditoriaLogInput} from './create-auditoriaLog.input';

@InputType()
export class UpdateAuditoriaLogInput extends PartialType(CreateAuditoriaLogInput) {
  @Field(() => ID)
  @IsNumber()
  id_log: number;
}
