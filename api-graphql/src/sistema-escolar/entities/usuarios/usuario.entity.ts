import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Float, Int} from "@nestjs/graphql";
import {Empleado} from "../empleados/empleado.entity";
import {Alumno} from "../alumnos/alumno.entity";
import {Tutor} from "../tutores/tutor.entity";
import {Rol} from "../roles/rol.entity";
import {AuditoriaLog} from "../auditorias-log/auditoria.entity";

@ObjectType()
@Entity('usuarios')
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Field(() => String)
  @Column({unique: true})
  username: number;

  @Field(() => String)
  @Column()
  password_hash: string;

  @Field(() => Int)
  @Column({type: "int"})
  rol_id: number;

  @Field(() => Int, {nullable: true})
  @Column({type: "int", nullable: true})
  empleado_id?: number;

  @Field(() => Int, {nullable: true})
  @Column({type: "int", nullable: true})
  alumno_id?: number;

  @Field(() => Int, {nullable: true})
  @Column({type: "int", nullable: true})
  tutor_id?: number;

  @Field(() => String)
  @Column()
  avatar_url: string;

  @Field(() => Date)
  @Column({type: "date"})
  ultimo_acceso: Date;

  @Field(() => Boolean)
  @Column({type: "boolean", default: true})
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Empleado, empleado => empleado.usuario, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'empleado_id'})
  empleado: Empleado;

  @OneToOne(() => Alumno, alumno => alumno.usuario, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'alumno_id'})
  alumno: Alumno;

  @OneToOne(() => Tutor, tutor => tutor.usuario, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'tutor_id'})
  tutor: Tutor;

  @ManyToOne(() => Rol, rol => rol.usuarios, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'rol_id'})
  rol: Rol;

  @OneToMany(() => AuditoriaLog, log => log.usuario)
  auditorias: AuditoriaLog[];
}
