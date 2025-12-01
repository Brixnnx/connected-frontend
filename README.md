# ConnectEd - Frontend Angular 17

Plataforma de networking profesional para estudiantes universitarios construida con Angular 17.

## Características Implementadas ✅

### 1. Autenticación y Seguridad
- ✅ Login con validación de email y contraseña
- ✅ Registro con validación de requisitos de contraseña
- ✅ JWT Token Authentication
- ✅ HTTP Interceptor para agregar token automáticamente
- ✅ Auth Guard para proteger rutas
- ✅ Role Guard para control de acceso basado en roles (RBAC)

### 2. Componentes Compartidos
- ✅ Header con navegación, búsqueda, notificaciones y menú de usuario
- ✅ Sidebar con menú lateral de navegación

### 3. Páginas Implementadas
- ✅ **Landing Page** - Hero section, características, testimonios, CTA
- ✅ **Dashboard** - Vista en 3 columnas (perfil, feed, sugerencias)
- ✅ **Mi Red** - 4 tabs (Contactos, Recibidas, Enviadas, Sugerencias)
- ✅ **Perfil** - Vista de perfil con modal de edición
- ✅ **Oportunidades** - 4 tabs (Empleos, Pasantías, Talleres, Eventos)
- ✅ **Mentorías** - Listado de mentores disponibles
- ✅ **Gamificación** - Sistema de puntos, niveles y logros

### 4. Modelos y Servicios
- ✅ 7 modelos TypeScript (Usuario, Conexión, Publicación, Oportunidad, etc.)
- ✅ 7 servicios HTTP con integración completa al backend
- ✅ Manejo de estados con RxJS

### 5. Sistema de Diseño
- ✅ Paleta de colores ConnectEd
- ✅ Sistema de cards consistente
- ✅ Componentes reutilizables (botones, formularios, badges, modales)
- ✅ Diseño responsive para mobile, tablet y desktop
- ✅ Animaciones y transiciones suaves

## Tecnologías

- **Angular 17.3.0** - Framework principal
- **TypeScript 5.4.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **SCSS** - Preprocesador CSS
- **Standalone Components** - Nueva arquitectura de Angular

## Estructura del Proyecto

```
connected-frontend/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   ├── models/
│   │   │   ├── usuario.model.ts
│   │   │   ├── conexion.model.ts
│   │   │   ├── publicacion.model.ts
│   │   │   ├── oportunidad.model.ts
│   │   │   ├── mensaje.model.ts
│   │   │   ├── puntuacion.model.ts
│   │   │   └── mentoria.model.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── usuario.service.ts
│   │   │   ├── conexion.service.ts
│   │   │   ├── publicacion.service.ts
│   │   │   ├── oportunidad.service.ts
│   │   │   ├── mensaje.service.ts
│   │   │   └── puntuacion.service.ts
│   │   ├── shared/
│   │   │   └── components/
│   │   │       ├── header/
│   │   │       └── sidebar/
│   │   ├── pages/
│   │   │   ├── landing/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   ├── my-network/
│   │   │   ├── profile/
│   │   │   ├── opportunities/
│   │   │   ├── mentorias/
│   │   │   └── gamification/
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   ├── styles.scss
│   └── main.ts
├── package.json
├── angular.json
└── tsconfig.json
```

## Requisitos Previos

- Node.js 18+ y npm
- Angular CLI 17
- Backend Spring Boot corriendo en http://localhost:8080

## Instalación

1. **Clonar el repositorio**
```bash
cd connected-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Verificar configuración del backend**

Edita `src/environments/environment.ts` si tu backend está en otra URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## Ejecución

### Modo Desarrollo

```bash
npm start
```

o

```bash
ng serve
```

La aplicación estará disponible en http://localhost:4200

### Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/connected-frontend/`

## Usuarios de Prueba

Una vez que el backend esté corriendo con los datos de prueba, puedes usar:

**Email:** `usuario@test.com`
**Password:** `Password123`

(Consulta el archivo `test-data.sql` del backend para más usuarios)

## Rutas Principales

| Ruta | Descripción | Requiere Auth | Rol Requerido |
|------|-------------|---------------|---------------|
| `/` | Landing Page | No | - |
| `/login` | Inicio de Sesión | No | - |
| `/register` | Registro | No | - |
| `/dashboard` | Dashboard Principal | Sí | - |
| `/my-network` | Mi Red | Sí | - |
| `/profile` | Perfil de Usuario | Sí | - |
| `/opportunities` | Oportunidades | Sí | - |
| `/mentorias` | Mentorías | Sí | - |
| `/gamification` | Gamificación | Sí | - |

## Características Principales por Página

### Landing Page
- Hero section con CTAs
- Estadísticas de la plataforma
- Características principales
- Cómo funciona (3 pasos)
- Testimonios de usuarios
- Footer completo

### Dashboard
- **Columna Izquierda:** Card de perfil con puntos y nivel, accesos rápidos
- **Columna Central:** Crear publicación, feed de publicaciones con reacciones
- **Columna Derecha:** Sugerencias de personas, temas trending

### Mi Red
- **Tab Contactos:** Grid de contactos actuales
- **Tab Recibidas:** Solicitudes de conexión recibidas (aceptar/rechazar)
- **Tab Enviadas:** Solicitudes enviadas (cancelar)
- **Tab Sugerencias:** Personas sugeridas (conectar)

### Perfil
- Cover image con avatar
- Información del usuario
- Estadísticas (publicaciones, puntos, nivel)
- Modal de edición de perfil
- Tabs: Actividad y Sobre mí

### Oportunidades
- Filtro por tipo: Empleos, Pasantías, Talleres, Eventos
- Cards con información detallada
- Badges por tipo de oportunidad

### Mentorías
- Grid de mentores disponibles
- Rating, años de experiencia, sesiones completadas
- Solicitar mentoría

### Gamificación
- Puntos totales y nivel actual
- Barra de progreso al siguiente nivel
- Historial de puntos ganados

## Sistema de Cards

Todos los componentes utilizan el sistema de cards definido en `styles.scss`:

```scss
.card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  // ...
}
```

Variantes disponibles:
- `.card` - Card básico
- `.card:hover` - Efectos hover
- `.card-title` - Título de card
- `.card-subtitle` - Subtítulo de card

## Responsive Design

El proyecto es completamente responsive con breakpoints:

- **Desktop:** > 1200px (sidebar completo)
- **Tablet:** 768px - 1200px (sidebar compacto)
- **Mobile:** < 768px (menú móvil)

## Integración con el Backend

### API Endpoints Utilizados

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `GET /usuarios/{id}` - Obtener usuario
- `PUT /usuarios/{id}` - Actualizar usuario
- `POST /conexiones/enviar` - Enviar solicitud de conexión
- `PUT /conexiones/{id}/aceptar` - Aceptar conexión
- `GET /publicaciones/feed` - Obtener feed
- `POST /publicaciones` - Crear publicación
- `GET /oportunidades` - Listar oportunidades
- `GET /puntuaciones/usuario/{id}` - Obtener puntos

### Autenticación JWT

El token JWT se almacena en `localStorage` y se incluye automáticamente en todas las peticiones mediante el `AuthInterceptor`.

## Próximos Pasos (Opcional)

- [ ] Componente de Feed completo con comentarios
- [ ] Componente de Mensajería con chat en tiempo real
- [ ] Sistema de notificaciones en tiempo real
- [ ] Upload de imágenes para perfil y publicaciones
- [ ] Búsqueda avanzada de usuarios
- [ ] Filtros avanzados en Oportunidades
- [ ] Sistema de reviews para mentorías

## Problemas Comunes

### Error de CORS
Si ves errores de CORS, asegúrate de que el backend tenga configurado:
```java
@CrossOrigin(origins = "http://localhost:4200")
```

### Token Expirado
Si el token expira, la aplicación te redirigirá automáticamente al login.

### Backend No Disponible
Verifica que el backend Spring Boot esté corriendo en http://localhost:8080

## Contribución

Este es un proyecto académico. Para contribuir:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Proyecto académico - Universidad Peruana de Ciencias Aplicadas (UPC)

## Autor

Desarrollado para el curso de Aplicaciones Web

---

**Estado del Proyecto:** ✅ 100% Completado

Para más información, consulta el archivo `IMPLEMENTATION-GUIDE.md`
