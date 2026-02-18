import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Rol} from '../../entities/roles/rol.entity';
import {CreateRolInput} from '../../dtos/rol/create-rol.input';
import {UpdateRolInput} from '../../dtos/rol/update-rol.input';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private repository: Repository<Rol>
  ) {}

  async create(data: CreateRolInput): Promise<Rol> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Rol[]> {
    return await this.repository.find();
  }

  async findOne(id_rol: number): Promise<Rol> {
    return await this.repository.findOneBy({id_rol});
  }

  async update(id_rol: number, data: UpdateRolInput): Promise<Rol> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_rol: ${id_rol} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_rol: number): Promise<boolean> {
    const result = await this.repository.delete({id_rol});
    return result.affected ? result.affected > 0 : false;
  }
}
