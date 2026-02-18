import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {ObjectType, Field, ID} from "@nestjs/graphql";
import {Usuario} from "../usuarios/usuario.entity";

@ObjectType()
@Entity('roles')
export class Rol {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Field(() => String)
  @Column({unique: true})
  nombre: string;

  @Field(() => String)
  @Column({type: "text"})
  descripcion: string;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];
}
