import {InputType, Field} from "@nestjs/graphql";
import {IsBoolean, IsNotEmpty} from "class-validator";

@InputType()
export class CreateTodoInput {

  @Field(() => String)
  @IsNotEmpty()
  description: string;

  @Field(() => Boolean, {nullable: true})
  @IsBoolean()
  done?: boolean;
}
