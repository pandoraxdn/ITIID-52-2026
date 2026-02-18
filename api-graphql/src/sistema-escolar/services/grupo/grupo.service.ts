import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Grupo} from '../../entities/grupos/grupo.entity';
import {CreateGrupoInput} from '../../dtos/grupo/create-grupo.input';
import {UpdateGrupoInput} from '../../dtos/grupo/update-grupo.input';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private repository: Repository<Grupo>
  ) {}

  async create(data: CreateGrupoInput): Promise<Grupo> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Grupo[]> {
    return await this.repository.find();
  }

  async findOne(id_grupo: number): Promise<Grupo> {
    return await this.repository.findOneBy({id_grupo});
  }

  async update(id_grupo: number, data: UpdateGrupoInput): Promise<Grupo> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_grupo: ${id_grupo} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_grupo: number): Promise<boolean> {
    const result = await this.repository.delete({id_grupo});
    return result.affected ? result.affected > 0 : false;
  }
}
