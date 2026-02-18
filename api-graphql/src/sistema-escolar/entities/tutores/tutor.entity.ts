import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne} from "typeorm";
import {ObjectType, Field, ID, Int, registerEnumType} from "@nestjs/graphql";
import {AlumnoTutor} from "../alumnos-tutores/alumno-tutor.entity";
import {Usuario} from "../usuarios/usuario.entity";

export enum TipoRelacion {
  PADRE = 'PADRE',
  MADRE = 'MADRE',
  TIO = 'TIO',
  ABUELO = 'ABUELO',
}

registerEnumType(TipoRelacion, {
  name: 'TipoRelacion',
});

@ObjectType()
@Entity('tutores')
export class Tutor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_tutor: number;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  apellido_p: string;

  @Field(() => String)
  @Column()
  apellido_m: string;

  @Field(() => TipoRelacion)
  @Column({type: "enum", enum: TipoRelacion, default: TipoRelacion.PADRE})
  relacion: TipoRelacion;

  @Field(() => String)
  @Column()
  telefono_principal: string;

  @Field(() => String)
  @Column()
  telefono_emergencia: string;

  @Field(() => String)
  @Column()
  email: string;

  @OneToMany(() => AlumnoTutor, at => at.tutor)
  alumnosTutores: AlumnoTutor[];

  @OneToOne(() => Usuario, usuario => usuario.tutor)
  usuario: Usuario;
}
