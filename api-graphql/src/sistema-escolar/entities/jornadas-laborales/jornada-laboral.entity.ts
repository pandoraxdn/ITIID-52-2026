import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Empleado} from "../empleados/empleado.entity";

export enum TipoNivelEstudio {
  LICENCIATURA = 'LICENCIATURA',
  MAESTRIA = 'MAESTRIA',
  DOCTORADO = 'DOCTORADO',
}

registerEnumType(TipoNivelEstudio, {
  name: 'TipoNivelEstudio',
});

@ObjectType()
@Entity('jornadas_laborales')
export class JornadaLaboral {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_jornada: number;

  @Field(() => Int)
  @Column({type: "int"})
  empleado_id: number;

  @Field(() => String)
  @Column()
  dia_semana: string;

  @Field(() => Date)
  @Column({type: "time"})
  horaEntrada: Date;

  @Field(() => String)
  @Column({type: "time"})
  horaSalida: string;

  @Field(() => Int)
  @Column({type: "int", default: 10})
  tolerancia_minutos: number;

  @ManyToOne(() => Empleado, empleado => empleado.jornadas, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'empleado_id'})
  empleado: Empleado;
}
