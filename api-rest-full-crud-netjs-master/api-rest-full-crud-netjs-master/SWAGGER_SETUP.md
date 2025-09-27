# 📚 Configuración de Swagger

## Instalación de Dependencias

Para completar la integración de Swagger y solucionar los errores de consola, necesitas instalar las siguientes dependencias:

```bash
# Dependencias de Swagger
npm install @nestjs/swagger swagger-ui-express

# Dependencia requerida para ValidationPipe
npm install class-transformer
```

**Nota**: Si tienes problemas de permisos, intenta:
```bash
sudo npm install @nestjs/swagger swagger-ui-express class-transformer
```

## ✅ Configuración Completada

La configuración de Swagger ya está implementada en el proyecto:

### 🔧 Archivos Configurados:
- ✅ `src/main.ts` - Configuración principal de Swagger
- ✅ `src/app.controller.ts` - Documentación del endpoint principal
- ✅ `src/users/users.controller.ts` - Documentación completa de endpoints CRUD
- ✅ `src/users/dto/create-user.dto.ts` - Documentación del DTO de creación
- ✅ `src/users/dto/update-user.dto.ts` - Documentación del DTO de actualización
- ✅ `src/users/entities/user.entity.ts` - Documentación de la entidad User

### 🚀 Cómo Usar Swagger

1. **Instala las dependencias** (si aún no lo has hecho):
   ```bash
   npm install @nestjs/swagger swagger-ui-express class-transformer
   ```

2. **Habilita la validación global** (después de instalar class-transformer):
   En `src/main.ts`, descomenta las líneas del ValidationPipe:
   ```typescript
   // Cambiar de:
   // app.useGlobalPipes(new ValidationPipe({
   //   whitelist: true,
   //   forbidNonWhitelisted: true,
   //   transform: true,
   // }));
   
   // A:
   app.useGlobalPipes(new ValidationPipe({
     whitelist: true,
     forbidNonWhitelisted: true,
     transform: true,
   }));
   ```

3. **Ejecuta la aplicación**:
   ```bash
   npm run start:dev
   ```

4. **Accede a la documentación**:
   - **URL de Swagger UI**: http://localhost:3000/api
   - **API Principal**: http://localhost:3000

### 🎯 Funcionalidades de Swagger Implementadas

#### 📋 Documentación General:
- **Título**: "API REST de Usuarios"
- **Descripción**: API completa para gestión de usuarios con operaciones CRUD
- **Versión**: 1.0
- **Tags organizados**: `app` y `users`

#### 🔍 Endpoints Documentados:

**App Controller (`/`):**
- `GET /` - Mensaje de bienvenida

**Users Controller (`/users`):**
- `POST /users` - Crear usuario
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### 📝 Características Avanzadas:
- **Ejemplos de datos** en todos los campos
- **Validaciones documentadas** (email, string, optional)
- **Códigos de respuesta HTTP** con descripciones
- **Esquemas de respuesta** definidos
- **Parámetros documentados** con ejemplos
- **Tipos de datos** especificados (UUID, email, date-time)

### 🧪 Pruebas con Swagger UI

Una vez que instales las dependencias y ejecutes la aplicación, podrás:

1. **Ver la documentación interactiva** en http://localhost:3000/api
2. **Probar endpoints directamente** desde la interfaz web
3. **Ver ejemplos de requests/responses**
4. **Validar esquemas de datos**
5. **Explorar la API** de forma intuitiva

### 🛠️ Validación Global Configurada

La aplicación incluye validación global con:
- `whitelist: true` - Solo acepta propiedades definidas en los DTOs
- `forbidNonWhitelisted: true` - Rechaza propiedades no permitidas
- `transform: true` - Transforma automáticamente los tipos de datos

## 🎉 ¡Swagger Completamente Integrado!

Tu API REST ahora tiene documentación profesional y interactiva con Swagger UI.
