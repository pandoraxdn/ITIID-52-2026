import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ConceptoPago} from '../../entities/conceptos-pago/concepto-pago.entity';
import {CreateConceptoPagoInput} from '../../dtos/conceptoPago/create-conceptoPago.input';
import {UpdateConceptoPagoInput} from '../../dtos/conceptoPago/update-conceptoPago.input';

@Injectable()
export class ConceptoPagoService {
  constructor(
    @InjectRepository(ConceptoPago)
    private repository: Repository<ConceptoPago>
  ) {}

  async create(data: CreateConceptoPagoInput): Promise<ConceptoPago> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<ConceptoPago[]> {
    return await this.repository.find();
  }

  async findOne(id_concepto: number): Promise<ConceptoPago | null> {
    return await this.repository.findOneBy({id_concepto});
  }

  async update(id_concepto: number, data: UpdateConceptoPagoInput): Promise<ConceptoPago> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_concepto: ${id_concepto} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_concepto: number): Promise<boolean> {
    const result = await this.repository.delete({id_concepto});
    return result.affected ? result.affected > 0 : false;
  }
}
