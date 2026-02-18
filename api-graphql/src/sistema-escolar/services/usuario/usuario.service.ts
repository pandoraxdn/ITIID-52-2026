import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Usuario} from '../../entities/usuarios/usuario.entity';
import {CreateUsuarioInput} from '../../dtos/usuario/create-usuario.input';
import {UpdateUsuarioInput} from '../../dtos/usuario/update-usuario.input';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>
  ) {}

  async create(data: CreateUsuarioInput): Promise<Usuario> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.repository.find();
  }

  async findOne(id_usuario: number): Promise<Usuario> {
    return await this.repository.findOneBy({id_usuario});
  }

  async update(id_usuario: number, data: UpdateUsuarioInput): Promise<Usuario> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_usuario: ${id_usuario} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_usuario: number): Promise<boolean> {
    const result = await this.repository.delete({id_usuario});
    return result.affected ? result.affected > 0 : false;
  }
}
