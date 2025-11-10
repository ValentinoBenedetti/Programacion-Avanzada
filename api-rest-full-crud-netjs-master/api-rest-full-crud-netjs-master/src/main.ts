import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global (requiere class-transformer)
  // Comentado temporalmente hasta instalar dependencias
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  // }));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API REST de Usuarios')
    .setDescription('API completa para gestión de usuarios con operaciones CRUD')
    .setVersion('1.0')
    .addTag('users', 'Operaciones relacionadas con usuarios')
    .addTag('app', 'Endpoints generales de la aplicación')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación Swagger disponible en: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
