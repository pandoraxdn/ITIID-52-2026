import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {DetGrupoMateria} from '../../entities/det-grupos-materias/det-grupo-materia.entity';
import {CreateDetGrupoMateriaInput} from '../../dtos/detGrupoMateria/create-detGrupoMateria.input';
import {UpdateDetGrupoMateriaInput} from '../../dtos/detGrupoMateria/update-detGrupoMateria.input';

@Injectable()
export class DetGrupoMateriaService {
  constructor(
    @InjectRepository(DetGrupoMateria)
    private repository: Repository<DetGrupoMateria>
  ) {}

  async create(data: CreateDetGrupoMateriaInput): Promise<DetGrupoMateria> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<DetGrupoMateria[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<DetGrupoMateria[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_det_grupo_materia: 'ASC'},
    });
  }

  async findOne(id_det_grupo_materia: number): Promise<DetGrupoMateria> {
    return await this.repository.findOneBy({id_det_grupo_materia});
  }

  async update(id_det_grupo_materia: number, data: UpdateDetGrupoMateriaInput): Promise<DetGrupoMateria> {
    data.id_det_grupo_materia = id_det_grupo_materia;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_det_grupo_materia: ${id_det_grupo_materia} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_det_grupo_materia: number): Promise<boolean> {
    const result = await this.repository.delete({id_det_grupo_materia});
    return result.affected ? result.affected > 0 : false;
  }
}
