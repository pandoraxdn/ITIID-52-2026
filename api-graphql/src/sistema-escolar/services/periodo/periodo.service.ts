import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Periodo} from '../../entities/periodos/periodo.entity';
import {CreatePeriodoInput} from '../../dtos/periodo/create-periodo.input';
import {UpdatePeriodoInput} from '../../dtos/periodo/update-periodo.input';

@Injectable()
export class PeriodoService {
  constructor(
    @InjectRepository(Periodo)
    private repository: Repository<Periodo>
  ) {}

  async create(data: CreatePeriodoInput): Promise<Periodo> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Periodo[]> {
    return await this.repository.find();
  }

  async findOne(id_periodo: number): Promise<Periodo> {
    return await this.repository.findOneBy({id_periodo});
  }

  async update(id_periodo: number, data: UpdatePeriodoInput): Promise<Periodo> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_periodo: ${id_periodo} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_periodo: number): Promise<boolean> {
    const result = await this.repository.delete({id_periodo});
    return result.affected ? result.affected > 0 : false;
  }
}
