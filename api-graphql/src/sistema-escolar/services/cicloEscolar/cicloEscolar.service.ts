import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CicloEscolar} from '../../entities/ciclos-escolares/ciclo-escolar.entity';
import {CreateCicloEscolarInput} from '../../dtos/cicloEscolar/create-cicloEscolar.input';
import {UpdateCicloEscolarInput} from '../../dtos/cicloEscolar/update-cicloEscolar.input';

@Injectable()
export class CicloEscolarService {
  constructor(
    @InjectRepository(CicloEscolar)
    private repository: Repository<CicloEscolar>
  ) {}

  async create(data: CreateCicloEscolarInput): Promise<CicloEscolar> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<CicloEscolar[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<CicloEscolar[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_ciclo: 'ASC'},
    });
  }

  async findOne(id_ciclo: number): Promise<CicloEscolar> {
    return await this.repository.findOneBy({id_ciclo});
  }

  async update(id_ciclo: number, data: UpdateCicloEscolarInput): Promise<CicloEscolar> {
    data.id_ciclo = id_ciclo;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_ciclo: ${id_ciclo} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_ciclo: number): Promise<boolean> {
    const result = await this.repository.delete({id_ciclo});
    return result.affected ? result.affected > 0 : false;
  }
}
