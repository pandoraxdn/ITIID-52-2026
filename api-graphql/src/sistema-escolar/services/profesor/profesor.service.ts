import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Profesor} from '../../entities/profesores/profesor.entity';
import {CreateProfesorInput} from '../../dtos/profesor/create-profesor.input';
import {UpdateProfesorInput} from '../../dtos/profesor/update-profesor.input';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(Profesor)
    private repository: Repository<Profesor>
  ) {}

  async create(data: CreateProfesorInput): Promise<Profesor> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Profesor[]> {
    return await this.repository.find();
  }

  async findOne(id_profesor: number): Promise<Profesor> {
    return await this.repository.findOneBy({id_profesor});
  }

  async update(id_profesor: number, data: UpdateProfesorInput): Promise<Profesor> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_profesor: ${id_profesor} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_profesor: number): Promise<boolean> {
    const result = await this.repository.delete({id_profesor});
    return result.affected ? result.affected > 0 : false;
  }
}
