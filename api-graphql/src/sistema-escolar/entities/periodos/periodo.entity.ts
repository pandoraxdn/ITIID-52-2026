import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {CicloEscolar} from "../ciclos-escolares/ciclo-escolar.entity";
import {Calificacion} from "../calificaciones/calificacion.entity";

@ObjectType()
@Entity('periodos')
export class Periodo {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_periodo: number;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  tipo: string;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_inicio: Date;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_fin: Date;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_limite_captura: Date;

  @Field(() => Int)
  @Column({type: "int"})
  ciclo_id: number;

  @ManyToOne(() => CicloEscolar, ciclo => ciclo.periodos, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'ciclo_id'})
  ciclo: CicloEscolar;

  @OneToMany(() => Calificacion, cal => cal.periodo)
  calificaciones: Calificacion[];
}
