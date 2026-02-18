import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, Float, registerEnumType} from "@nestjs/graphql";
import {Alumno} from "../alumnos/alumno.entity";
import {MenuComedor} from "../menus-comedor/menu-comedor.entity";

export enum TipoConsumo {
  MENUESCOLAR = 'MENU ESCOLAR',
  COMIDACASA = 'COMIDA DE CASA',
  NOCOMIO = 'NO COMIO',
}

registerEnumType(TipoConsumo, {
  name: 'TipoConsumo',
});

@ObjectType()
@Entity('consumos-comedor')
export class ConsumoComedor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_consumo: number;

  @Field(() => Int)
  @Column({type: "int"})
  alumno_id: number;

  @Field(() => Date)
  @Column({type: "date"})
  fecha: Date;

  @Field(() => TipoConsumo)
  @Column({type: "enum", enum: TipoConsumo, default: TipoConsumo.MENUESCOLAR})
  tipo_consumo: TipoConsumo;

  @Field(() => Int)
  @Column({type: "int"})
  menu_id: number;

  @Field(() => String)
  @Column({type: "text"})
  observaciones: string;

  @Field(() => String)
  @Column({type: "text"})
  reporte_incidencia: string;

  @ManyToOne(() => Alumno, alumno => alumno.consumos, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'alumno_id'})
  alumno: Alumno;

  @ManyToOne(() => MenuComedor, menu => menu.consumos, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'menu_id'})
  menu: MenuComedor;
}
