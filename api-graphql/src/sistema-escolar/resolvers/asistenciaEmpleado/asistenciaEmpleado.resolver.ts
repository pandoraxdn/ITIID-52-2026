import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {AsistenciaEmpleado} from '../../entities';
import {AsistenciaEmpleadoService} from '../../services/asistenciaEmpleado/asistenciaEmpleado.service';
import {CreateAsistenciaEmpleadoInput} from '../../dtos/asistenciaEmpleado/create-asistenciaEmpleado.input';
import {UpdateAsistenciaEmpleadoInput} from '../../dtos/asistenciaEmpleado/update-asistenciaEmpleado.input';

@Resolver(() => AsistenciaEmpleado)
export class AsistenciaEmpleadoResolver {
  constructor(private readonly service: AsistenciaEmpleadoService) {}

  @Query(() => [AsistenciaEmpleado], {name: 'asistenciasEmpleados'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => AsistenciaEmpleado, {name: 'asistenciaEmpleado'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => AsistenciaEmpleado, {name: 'createAsistenciaEmpleado'})
  create(@Args('input') input: CreateAsistenciaEmpleadoInput) {
    return this.service.create(input);
  }

  @Mutation(() => AsistenciaEmpleado, {name: 'updateAsistenciaEmpleado'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateAsistenciaEmpleadoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteAsistenciaEmpleado'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
