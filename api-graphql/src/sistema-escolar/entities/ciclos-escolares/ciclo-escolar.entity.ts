import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from "typeorm";
import {ObjectType, Field, ID} from "@nestjs/graphql";
import {Grupo} from "../grupos/grupo.entity";
import {Periodo} from "../periodos/periodo.entity";
import {MenuComedor} from "../menus-comedor/menu-comedor.entity";
import {Inscripcion} from "../inscripciones/inscripcion.entity";

@ObjectType()
@Entity('ciclos_escolares')
export class CicloEscolar {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_ciclo: number;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_inicio: Date;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_fin: Date;

  @Field(() => Boolean)
  @Column()
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Grupo, grupo => grupo.ciclo)
  grupos: Grupo[];

  @OneToMany(() => Periodo, periodo => periodo.ciclo)
  periodos: Periodo[];

  @OneToMany(() => MenuComedor, menu => menu.ciclo)
  menus: MenuComedor[];

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.ciclo)
  inscripciones: Inscripcion[];
}
