import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Pago} from 'src/sistema-escolar/entities/pagos/pago.entity';
import {CreatePagoInput} from '../../dtos/pago/create-pago.input';
import {UpdatePagoInput} from '../../dtos/pago/update-pago.input';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private repository: Repository<Pago>
  ) {}

  async create(data: CreatePagoInput): Promise<Pago> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Pago[]> {
    return await this.repository.find();
  }

  async findOne(id_pago: number): Promise<Pago> {
    return await this.repository.findOneBy({id_pago});
  }

  async update(id_pago: number, data: UpdatePagoInput): Promise<Pago> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_pago: ${id_pago} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_pago: number): Promise<boolean> {
    const result = await this.repository.delete({id_pago});
    return result.affected ? result.affected > 0 : false;
  }
}
