import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {HorarioClase} from '../../entities/horarios-clase/horario-clase.entity';
import {CreateHorarioClaseInput} from '../../dtos/horarioClase/create-horarioClase.input';
import {UpdateHorarioClaseInput} from '../../dtos/horarioClase/update-horarioClase.input';

@Injectable()
export class HorarioClaseService {
  constructor(
    @InjectRepository(HorarioClase)
    private repository: Repository<HorarioClase>
  ) {}

  async create(data: CreateHorarioClaseInput): Promise<HorarioClase> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<HorarioClase[]> {
    return await this.repository.find();
  }

  async findOne(id_horario_clase: number): Promise<HorarioClase> {
    return await this.repository.findOneBy({id_horario_clase});
  }

  async update(id_horario_clase: number, data: UpdateHorarioClaseInput): Promise<HorarioClase> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_horario_clase: ${id_horario_clase} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_horario_clase: number): Promise<boolean> {
    const result = await this.repository.delete({id_horario_clase});
    return result.affected ? result.affected > 0 : false;
  }
}
