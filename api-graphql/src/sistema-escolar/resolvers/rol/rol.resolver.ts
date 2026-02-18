import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Rol} from '../../entities/roles/rol.entity';
import {RolService} from '../../services/rol/rol.service';
import {CreateRolInput} from '../../dtos/rol/create-rol.input';
import {UpdateRolInput} from '../../dtos/rol/update-rol.input';

@Resolver(() => Rol)
export class RolResolver {
  constructor(private readonly service: RolService) {}

  @Query(() => [Rol], {name: 'roles'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Rol, {name: 'rol'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Rol, {name: 'createRol'})
  create(@Args('input') input: CreateRolInput) {
    return this.service.create(input);
  }

  @Mutation(() => Rol, {name: 'updateRol'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateRolInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteRol'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
