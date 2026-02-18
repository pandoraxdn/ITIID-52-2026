import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsNotEmpty, IsString} from 'class-validator';
import {Usuario} from 'src/sistema-escolar/entities/usuarios/usuario.entity';

@InputType()
export class CreateRolInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
