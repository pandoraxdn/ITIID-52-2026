import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Tarea} from './entities/tarea.entity';
import {CreateTareaDto} from './dto/create-tarea.dto';
import {UpdateTareaDto} from './dto/update-tarea.dto';

@Injectable()
export class TareaService {
  constructor(
    @InjectRepository(Tarea)
    private tareaRepository: Repository<Tarea>
  ) {}

  async create(data: CreateTareaDto) {
    const register = this.tareaRepository.create(data);
    return await this.tareaRepository.save(register);
  }

  async findAll() {
    return await this.tareaRepository.find();
  }

  async findOne(id_tarea: number) {
    return await this.tareaRepository.findBy({id_tarea});
  }

  async update(id_tarea: number, data: UpdateTareaDto) {
    return await this.tareaRepository.update(id_tarea, data);
  }

  async remove(id_tarea: number) {
    return await this.tareaRepository.delete(id_tarea);
  }
}
