import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Grupo} from '../../entities/grupos/grupo.entity';
import {GrupoService} from '../../services/grupo/grupo.service';
import {CreateGrupoInput} from '../../dtos/grupo/create-grupo.input';
import {UpdateGrupoInput} from '../../dtos/grupo/update-grupo.input';

@Resolver(() => Grupo)
export class GrupoResolver {
  constructor(private readonly service: GrupoService) {}

  @Query(() => [Grupo], {name: 'grupos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Grupo, {name: 'grupo'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Grupo, {name: 'createGrupo'})
  create(@Args('input') input: CreateGrupoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Grupo, {name: 'updateGrupo'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateGrupoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteGrupo'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
