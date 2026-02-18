import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Empleado} from '../../entities/empleados/empleado.entity';
import {EmpleadoService} from '../../services/empleado/empleado.service';
import {CreateEmpleadoInput} from '../../dtos/empleado/create-empleado.input';
import {UpdateEmpleadoInput} from '../../dtos/empleado/update-empleado.input';

@Resolver(() => Empleado)
export class EmpleadoResolver {
  constructor(private readonly service: EmpleadoService) {}

  @Query(() => [Empleado], {name: 'empleados'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Empleado, {name: 'empleado'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Empleado, {name: 'createEmpleado'})
  create(@Args('input') input: CreateEmpleadoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Empleado, {name: 'updateEmpleado'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateEmpleadoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteEmpleado'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
