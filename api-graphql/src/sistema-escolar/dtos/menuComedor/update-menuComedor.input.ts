import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateMenuComedorInput} from './create-menuComedor.input';

@InputType()
export class UpdateMenuComedorInput extends PartialType(CreateMenuComedorInput) {
  @Field(() => ID)
  @IsNumber()
  id_menu: number;
}
