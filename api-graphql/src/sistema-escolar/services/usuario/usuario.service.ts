import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Usuario} from '../../entities/usuarios/usuario.entity';
import {CreateUsuarioInput} from '../../dtos/usuario/create-usuario.input';
import {UpdateUsuarioInput} from '../../dtos/usuario/update-usuario.input';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>
  ) {}

  async login(data: UpdateUsuarioInput){
    try{
      const user: Usuario = await this.repository.findOneBy({ username: data.username })
      return ( await bcrypt.compare(data.password_hash, user.password_hash) ) ? user : false;
    }catch(error){
      return false;
    }
  }

  async create(data: CreateUsuarioInput): Promise<Usuario> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password_hash, saltOrRounds);
    const register = {...data, password_hash: hash};
    const new_user = this.repository.create(register);
    return await this.repository.save(new_user);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<Usuario[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_usuario: 'ASC'},
    });
  }

  async findOne(id_usuario: number): Promise<Usuario> {
    return await this.repository.findOneBy({id_usuario});
  }

  async update(id_usuario: number, data: UpdateUsuarioInput): Promise<Usuario> {
    if (data.password_hash) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password_hash, saltOrRounds);
      data.password_hash = hash;
    }
    const register = await this.repository.preload({
      ...data,
      id_usuario,
    });
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
