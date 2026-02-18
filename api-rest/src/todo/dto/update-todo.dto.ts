import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateTodo {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
