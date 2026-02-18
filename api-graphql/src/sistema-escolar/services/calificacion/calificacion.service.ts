import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Calificacion} from '../../entities/calificaciones/calificacion.entity';
import {CreateCalificacionInput} from '../../dtos/calificacion/create-calificacion.input';
import {UpdateCalificacionInput} from '../../dtos/calificacion/update-calificacion.input';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private repository: Repository<Calificacion>
  ) {}

  async create(data: CreateCalificacionInput): Promise<Calificacion> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Calificacion[]> {
    return await this.repository.find();
  }

  async findOne(id_calificacion: number): Promise<Calificacion> {
    return await this.repository.findOneBy({id_calificacion});
  }

  async update(id_calificacion: number, data: UpdateCalificacionInput): Promise<Calificacion> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_calificacion: ${id_calificacion} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_calificacion: number): Promise<boolean> {
    const result = await this.repository.delete({id_calificacion});
    return result.affected ? result.affected > 0 : false;
  }
}
