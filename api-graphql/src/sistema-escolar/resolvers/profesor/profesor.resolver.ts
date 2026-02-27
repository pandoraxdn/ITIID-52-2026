import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Profesor} from '../../entities/profesores/profesor.entity';
import {ProfesorService} from '../../services/profesor/profesor.service';
import {CreateProfesorInput} from '../../dtos/profesor/create-profesor.input';
import {UpdateProfesorInput} from '../../dtos/profesor/update-profesor.input';

@Resolver(() => Profesor)
export class ProfesorResolver {
  constructor(private readonly service: ProfesorService) {}

  @Query(() => [Profesor], {name: 'profesores'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Profesor], {name: 'profesoresP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Profesor, {name: 'profesor'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Profesor, {name: 'createProfesor'})
  create(@Args('input') input: CreateProfesorInput) {
    return this.service.create(input);
  }

  @Mutation(() => Profesor, {name: 'updateProfesor'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateProfesorInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeProfesor'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
