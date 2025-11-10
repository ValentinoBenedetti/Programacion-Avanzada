import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Mensaje de bienvenida',
    description: 'Endpoint de prueba que retorna un mensaje de bienvenida'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Mensaje de bienvenida exitoso',
    schema: {
      type: 'string',
      example: 'Hello World! API REST de usuarios funcionando correctamente.'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
