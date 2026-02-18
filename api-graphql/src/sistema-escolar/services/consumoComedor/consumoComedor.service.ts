import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ConsumoComedor} from '../../entities/consumos-comedor/consumo-comedor.entity';
import {CreateConsumoComedorInput} from '../../dtos/consumoComedor/create-consumoComedor.input';
import {UpdateConsumoComedorInput} from '../../dtos/consumoComedor/update-consumoComedor.input';

@Injectable()
export class ConsumoComedorService {
  constructor(
    @InjectRepository(ConsumoComedor)
    private repository: Repository<ConsumoComedor>
  ) {}

  async create(data: CreateConsumoComedorInput): Promise<ConsumoComedor> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<ConsumoComedor[]> {
    return await this.repository.find();
  }

  async findOne(id_consumo: number): Promise<ConsumoComedor> {
    return await this.repository.findOneBy({id_consumo});
  }

  async update(id_consumo: number, data: UpdateConsumoComedorInput): Promise<ConsumoComedor> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_consumo: ${id_consumo} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_consumo: number): Promise<boolean> {
    const result = await this.repository.delete({id_consumo});
    return result.affected ? result.affected > 0 : false;
  }
}
