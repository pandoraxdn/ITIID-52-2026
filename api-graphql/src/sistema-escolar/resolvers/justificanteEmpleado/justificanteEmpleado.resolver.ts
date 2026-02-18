import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {JustificanteEmpleado} from '../../entities/justificantes-empleados/justificante-empleado.entity';
import {JustificanteEmpleadoService} from '../../services/justificanteEmpleado/justificanteEmpleado.service';
import {CreateJustificanteEmpleadoInput} from '../../dtos/justificanteEmpleado/create-justificanteEmpleado.input';
import {UpdateJustificanteEmpleadoInput} from '../../dtos/justificanteEmpleado/update-justificanteEmpleado.input';

@Resolver(() => JustificanteEmpleado)
export class JustificanteEmpleadoResolver {
  constructor(private readonly service: JustificanteEmpleadoService) {}

  @Query(() => [JustificanteEmpleado], {name: 'justificantesEmpleado'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => JustificanteEmpleado, {name: 'justificanteEmpleado'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => JustificanteEmpleado, {name: 'createJustificanteEmpleado'})
  create(@Args('input') input: CreateJustificanteEmpleadoInput) {
    return this.service.create(input);
  }

  @Mutation(() => JustificanteEmpleado, {name: 'updateJustificanteEmpleado'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateJustificanteEmpleadoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => JustificanteEmpleado, {name: 'deleteJustificanteEmpleado'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
