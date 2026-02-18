import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Float, Int} from "@nestjs/graphql";
import {Usuario} from "../usuarios/usuario.entity";

@ObjectType()
@Entity('auditorias_log')
export class AuditoriaLog {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_log: number;

  @Field(() => Int)
  @Column({type: "int"})
  usuario_id: number;

  @Field(() => String)
  @Column()
  accion: string;

  @Field(() => String)
  @Column()
  tabla_afectada: string;

  @Field(() => Int)
  @Column({type: "int"})
  registro_id: number;

  @Field(() => String)
  @Column()
  valor_anterior: string;

  @Field(() => String)
  @Column()
  valor_nuevo: string;

  @Field(() => Date)
  @CreateDateColumn({type: 'date'})
  fecha: Date;

  @Field(() => String)
  @Column()
  ip: string;

  @ManyToOne(() => Usuario, usuario => usuario.auditorias, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'usuario_id'})
  usuario: Usuario;
}
