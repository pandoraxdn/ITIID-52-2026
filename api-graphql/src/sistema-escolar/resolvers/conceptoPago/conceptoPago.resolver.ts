import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {ConceptoPago} from '../../entities/conceptos-pago/concepto-pago.entity';
import {ConceptoPagoService} from '../../services/conceptoPago/conceptoPago.service';
import {CreateConceptoPagoInput} from '../../dtos/conceptoPago/create-conceptoPago.input';
import {UpdateConceptoPagoInput} from '../../dtos/conceptoPago/update-conceptoPago.input';

@Resolver(() => ConceptoPago)
export class ConceptoPagoResolver {
  constructor(private readonly service: ConceptoPagoService) {}

  @Query(() => [ConceptoPago], {name: 'concetosPago'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => ConceptoPago, {name: 'conceptoPago'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => ConceptoPago, {name: 'createConceptoPago'})
  create(@Args('input') input: CreateConceptoPagoInput) {
    return this.service.create(input);
  }

  @Mutation(() => ConceptoPago, {name: 'updateConceptoPago'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateConceptoPagoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeConceptoPago'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
