import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {DetGrupoMateria} from '../../entities/det-grupos-materias/det-grupo-materia.entity';
import {DetGrupoMateriaService} from '../../services/detGrupoMateria/detGrupoMateria.service';
import {CreateDetGrupoMateriaInput} from '../../dtos/detGrupoMateria/create-detGrupoMateria.input';
import {UpdateDetGrupoMateriaInput} from '../../dtos/detGrupoMateria/update-detGrupoMateria.input';

@Resolver(() => DetGrupoMateria)
export class DetGrupoMateriaResolver {
  constructor(private readonly service: DetGrupoMateriaService) {}

  @Query(() => [DetGrupoMateria], {name: 'detGruposMaterias'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [DetGrupoMateria], {name: 'detGruposMateriasP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => DetGrupoMateria, {name: 'detGrupoMateria'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => DetGrupoMateria, {name: 'createDetGrupoMateria'})
  create(@Args('input') input: CreateDetGrupoMateriaInput) {
    return this.service.create(input);
  }

  @Mutation(() => DetGrupoMateria, {name: 'updateDetGrupoMateria'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateDetGrupoMateriaInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeDetGrupoMateria'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
