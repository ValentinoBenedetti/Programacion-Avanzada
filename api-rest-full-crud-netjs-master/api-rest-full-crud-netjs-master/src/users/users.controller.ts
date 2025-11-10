import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con los datos proporcionados'
  })
  @ApiBody({ 
    type: CreateUserDto,
    description: 'Datos del usuario a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos'
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Retorna una lista con todos los usuarios registrados en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de usuarios obtenida exitosamente',
    type: [User]
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un usuario por ID',
    description: 'Busca y retorna un usuario específico usando su ID único'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado'
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un usuario',
    description: 'Actualiza parcialmente los datos de un usuario existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del usuario a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ 
    type: UpdateUserDto,
    description: 'Datos del usuario a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente',
    type: User
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos'
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar un usuario',
    description: 'Elimina permanentemente un usuario del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del usuario a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Usuario eliminado exitosamente'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado'
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
