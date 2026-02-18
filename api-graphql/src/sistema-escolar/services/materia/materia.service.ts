import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Materia} from '../../entities/materias/materia.entity';
import {CreateMateriaInput} from '../../dtos/materia/create-materia.input';
import {UpdateMateriaInput} from '../../dtos/materia/update-materia.input';

@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private repository: Repository<Materia>
  ) {}

  async create(data: CreateMateriaInput): Promise<Materia> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Materia[]> {
    return await this.repository.find();
  }

  async findOne(id_materia: number): Promise<Materia> {
    return await this.repository.findOneBy({id_materia});
  }

  async update(id_materia: number, data: UpdateMateriaInput): Promise<Materia> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_materia: ${id_materia} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_materia: number): Promise<boolean> {
    const result = await this.repository.delete({id_materia});
    return result.affected ? result.affected > 0 : false;
  }
}
