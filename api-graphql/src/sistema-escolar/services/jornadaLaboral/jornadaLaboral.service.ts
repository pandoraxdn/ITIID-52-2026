import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {JornadaLaboral} from '../../entities/jornadas-laborales/jornada-laboral.entity';
import {CreateJornadaLaboralInput} from '../../dtos/jornadaLaboral/create-jornadaLaboral.input';
import {UpdateJornadaLaboralInput} from '../../dtos/jornadaLaboral/update-jornadaLaboral.input';

@Injectable()
export class JornadaLaboralService {
  constructor(
    @InjectRepository(JornadaLaboral)
    private repository: Repository<JornadaLaboral>
  ) {}

  async create(data: CreateJornadaLaboralInput): Promise<JornadaLaboral> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<JornadaLaboral[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<JornadaLaboral[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_jornada: 'ASC'},
    });
  }

  async findOne(id_jornada: number): Promise<JornadaLaboral> {
    return await this.repository.findOneBy({id_jornada});
  }

  async update(id_jornada: number, data: UpdateJornadaLaboralInput): Promise<JornadaLaboral> {
    data.id_jornada = id_jornada;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_jornada: ${id_jornada} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_jornada: number): Promise<boolean> {
    const result = await this.repository.delete({id_jornada});
    return result.affected ? result.affected > 0 : false;
  }
}
