import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Usuario} from '../../entities/usuarios/usuario.entity';
import {UsuarioService} from '../../services/usuario/usuario.service';
import {CreateUsuarioInput} from '../../dtos/usuario/create-usuario.input';
import {UpdateUsuarioInput} from '../../dtos/usuario/update-usuario.input';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private readonly service: UsuarioService) {}

  @Query(() => [Usuario], {name: 'usuarios'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Usuario], {name: 'usuariosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Usuario, {name: 'usuario'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Usuario, {name: 'createUsuario'})
  create(@Args('input') input: CreateUsuarioInput) {
    return this.service.create(input);
  }

  @Mutation(() => Usuario, {name: 'updateUsuario'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateUsuarioInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeUsuario'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
