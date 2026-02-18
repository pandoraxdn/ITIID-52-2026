import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany} from "typeorm";
import {ObjectType, Field, ID, Int, registerEnumType} from "@nestjs/graphql";
import {Profesor} from "../profesores/profesor.entity";
import {JornadaLaboral} from "../jornadas-laborales/jornada-laboral.entity";
import {AsistenciaEmpleado} from "../asistencias-empleados/asistencia-empleado.entity";
import {JustificanteEmpleado} from "../justificantes-empleados/justificante-empleado.entity";
import {Usuario} from "../usuarios/usuario.entity";

export enum TipoEmpleado {
  DOCENTE = 'DOCENTE',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  OPERATIVO = 'OPERATIVO',
}

export enum TipoPuesto {
  MAESTRO = 'MAESTRO',
  DIRECTOR = 'DIRECTOR',
  LIMPIEZA = 'LIMPIEZA',
  SEGURIDAD = 'SEGURIDAD',
}

registerEnumType(TipoEmpleado, {
  name: 'TipoEmpleado',
});

registerEnumType(TipoPuesto, {
  name: 'TipoPuesto',
});

@ObjectType()
@Entity('empleados')
export class Empleado {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_empleado: number;

  @Field(() => String)
  @Column({unique: true})
  numero_empleado: string;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  apellido_p: string;

  @Field(() => String)
  @Column()
  apellido_m: string;

  @Field(() => String)
  @Column()
  email_personal: string;

  @Field(() => String)
  @Column()
  email_institucional: string;

  @Field(() => String)
  @Column()
  telefono: string;

  @Field(() => TipoEmpleado)
  @Column({type: "enum", enum: TipoEmpleado})
  tipo_empleado: TipoEmpleado;

  @Field(() => TipoPuesto)
  @Column({type: "enum", enum: TipoPuesto})
  puesto: TipoPuesto;

  @Field(() => String)
  @Column()
  departamento: string;

  @Field()
  @Column({type: 'date'})
  fecha_contratacion: Date;

  @Field(() => Boolean)
  @Column({default: true})
  activo: boolean;

  @OneToOne(() => Profesor, profesor => profesor.empleado)
  profesor: Profesor;

  @OneToMany(() => JornadaLaboral, j => j.empleado)
  jornadas: JornadaLaboral[];

  @OneToMany(() => AsistenciaEmpleado, a => a.empleado)
  asistencias: AsistenciaEmpleado[];

  @OneToMany(() => JustificanteEmpleado, j => j.empleado)
  justificantes: JustificanteEmpleado[];

  @OneToOne(() => Usuario, usuario => usuario.empleado)
  usuario: Usuario;
}
