import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsEnum, IsNotEmpty, IsString} from 'class-validator';
import {TipoRelacion} from 'src/sistema-escolar/entities/tutores/tutor.entity';

@InputType()
export class CreateTutorInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_p: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_m: string;

  @Field(() => String)
  @IsEnum(TipoRelacion)
  @IsNotEmpty()
  relacion: TipoRelacion;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  telefono_principal: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  telefono_emergencia: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email: string;
}
