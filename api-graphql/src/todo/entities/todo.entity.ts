import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@ObjectType()
@Entity("todos")
export class Todo {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id_todo: string;

  @Field(() => String)
  @Column('varchar')
  description: string;

  @Field(() => Boolean)
  @Column('boolean', {default: false})
  done?: boolean;
}
