import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Pago} from '../../entities/pagos/pago.entity';
import {PagoService} from '../../services/pago/pago.service';
import {CreatePagoInput} from '../../dtos/pago/create-pago.input';
import {UpdatePagoInput} from '../../dtos/pago/update-pago.input';

@Resolver(() => Pago)
export class PagoResolver {
  constructor(private readonly service: PagoService) {}

  @Query(() => [Pago], {name: 'pagos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Pago, {name: 'pago'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Pago, {name: 'createPago'})
  create(@Args('input') input: CreatePagoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Pago, {name: 'updatePago'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdatePagoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deletePago'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
