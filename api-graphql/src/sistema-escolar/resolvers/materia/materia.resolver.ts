import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Materia} from '../../entities/materias/materia.entity';
import {MateriaService} from '../../services/materia/materia.service';
import {CreateMateriaInput} from '../../dtos/materia/create-materia.input';
import {UpdateMateriaInput} from '../../dtos/materia/update-materia.input';

@Resolver(() => Materia)
export class MateriaResolver {
  constructor(private readonly service: MateriaService) {}

  @Query(() => [Materia], {name: 'materias'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Materia], {name: 'materiasP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Materia, {name: 'materia'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Materia, {name: 'createMateria'})
  create(@Args('input') input: CreateMateriaInput) {
    return this.service.create(input);
  }

  @Mutation(() => Materia, {name: 'updateMateria'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateMateriaInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeMateria'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
