# ⚙️ Instrucciones de Instalación y Ejecución - ConnectED

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Angular CLI** (v18)
- **PostgreSQL** (v14 o superior)
- **Java JDK** (v21)
- **Maven** (v3.8 o superior)

---

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos PostgreSQL

```sql
-- Conéctate a PostgreSQL
psql -U postgres

-- Crea la base de datos
CREATE DATABASE molinaBDPC1;

-- Sal de PostgreSQL
\q
```

### 2. Configurar Credenciales

El backend ya está configurado para PostgreSQL local en:
```
MolinaChirinosTP (5)/MolinaChirinosTP/src/main/resources/application.properties
```

**Configuración actual:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/molinaBDPC1
spring.datasource.username=postgres
spring.datasource.password=1234
```

**Si tus credenciales son diferentes, edita:**
- `username`: Tu usuario de PostgreSQL
- `password`: Tu contraseña de PostgreSQL

---

## 🔧 Instalación del Backend (Spring Boot)

### 1. Navega al directorio del backend

```bash
cd "MolinaChirinosTP (5)\MolinaChirinosTP"
```

### 2. Compila el proyecto con Maven

```bash
mvn clean install
```

### 3. Ejecuta el backend

```bash
mvn spring-boot:run
```

**O usando el JAR generado:**
```bash
java -jar target/molinachirinostp-0.0.1-SNAPSHOT.jar
```

### 4. Verifica que esté corriendo

El backend debe estar disponible en:
```
http://localhost:8080
```

**Endpoints principales:**
```
POST   http://localhost:8080/auth/register
POST   http://localhost:8080/auth/login
GET    http://localhost:8080/api/usuarios
GET    http://localhost:8080/api/conexiones/contactos/{id}
GET    http://localhost:8080/api/mensajes/conversacion
POST   http://localhost:8080/api/oportunidades
POST   http://localhost:8080/connected/mentores
```

---

## 🎨 Instalación del Frontend (Angular)

### 1. Navega al directorio del frontend

```bash
cd connected-frontend
```

### 2. Instala las dependencias

```bash
npm install
```

**Si hay errores, prueba:**
```bash
npm install --legacy-peer-deps
```

### 3. Verifica la configuración del API

Edita el archivo:
```
src/environments/environment.ts
```

**Configuración local:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### 4. Ejecuta el frontend

```bash
ng serve
```

**O con puerto específico:**
```bash
ng serve --port 4200
```

### 5. Abre en el navegador

```
http://localhost:4200
```

---

## 🚀 Ejecución Completa (Backend + Frontend)

### Opción 1: Terminales Separadas

**Terminal 1 (Backend):**
```bash
cd "MolinaChirinosTP (5)\MolinaChirinosTP"
mvn spring-boot:run
```

**Terminal 2 (Frontend):**
```bash
cd connected-frontend
ng serve
```

### Opción 2: Usando scripts npm (si los tienes)

```bash
npm run start:backend
npm run start:frontend
```

---

## 📝 Primer Uso - Crear Usuario

### 1. Abre el navegador en `http://localhost:4200`

### 2. Click en "Registrarse"

### 3. Completa el formulario:

```
Primer Nombre: Rafael
Primer Apellido: Peña
Email: rafael@test.com
Password: 123456
País: Perú
Ciudad: Lima
Fecha de Nacimiento: 2000-01-01
Descripción: Desarrollador Full Stack
```

### 4. Click en "Registrarse"

### 5. Inicia sesión con las credenciales creadas

---

## 🔍 Verificar que Todo Funciona

### Backend

**Verificar base de datos:**
```bash
psql -U postgres -d molinaBDPC1
\dt
# Debes ver las tablas: usuario, conexion, mensaje, oportunidad, mentor, etc.
```

**Verificar logs del backend:**
- Hibernate debe mostrar: `Hibernate: create table...` (primera vez)
- Spring Boot debe mostrar: `Started MolinachirinostpApplication`

### Frontend

**Verificar consola del navegador:**
- No debe haber errores 404
- Las peticiones HTTP deben ser exitosas (200, 201)

**Navegar por las páginas:**
- `/dashboard` - Debe cargar correctamente
- `/my-network` - Debe mostrar tabs
- `/mentorias` - Debe listar mentores
- `/opportunities` - Debe listar oportunidades
- `/mentorias-create` - Debe mostrar formulario
- `/opportunities-create` - Debe mostrar tabs

---

## 🛠️ Solución de Problemas Comunes

### Error: "Cannot connect to PostgreSQL"

**Solución:**
1. Verifica que PostgreSQL esté corriendo:
   ```bash
   # Windows
   services.msc → Busca PostgreSQL
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verifica credenciales en `application.properties`

3. Verifica que la base de datos existe:
   ```bash
   psql -U postgres -l
   ```

### Error: "Port 8080 already in use"

**Solución:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Error: "Port 4200 already in use"

**Solución:**
```bash
ng serve --port 4300
```

### Error: "Module not found" en Angular

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Error: "CORS policy" en peticiones HTTP

**Solución:**
Verifica que el backend tenga configurado CORS en:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
```

---

## 📊 Verificar Persistencia de Datos

### 1. Registra un usuario

### 2. Envía mensajes a otros usuarios

### 3. Acepta conexiones

### 4. Cierra sesión

### 5. Verifica en la base de datos:

```sql
-- Conecta a la BD
psql -U postgres -d molinaBDPC1

-- Verifica usuarios
SELECT * FROM usuario;

-- Verifica conexiones
SELECT * FROM conexion;

-- Verifica mensajes
SELECT * FROM mensaje;

-- Sal
\q
```

### 6. Inicia sesión de nuevo

**Resultado esperado:**
- ✅ Tus contactos siguen ahí
- ✅ Tus mensajes persisten
- ✅ Tu perfil está completo

---

## 🔄 Reiniciar Base de Datos (Datos de Prueba)

Si quieres empezar de cero:

```bash
# Conecta a PostgreSQL
psql -U postgres

# Elimina y recrea la base de datos
DROP DATABASE molinaBDPC1;
CREATE DATABASE molinaBDPC1;

# Sal
\q
```

Al reiniciar el backend, Hibernate recreará las tablas automáticamente.

---

## 📦 Build para Producción

### Backend

```bash
cd "MolinaChirinosTP (5)\MolinaChirinosTP"
mvn clean package -DskipTests
# JAR generado en: target/molinachirinostp-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd connected-frontend
ng build --configuration production
# Archivos generados en: dist/connected-frontend
```

---

## 🌐 Desplegar en Producción

### Backend (Render, Heroku, Railway)

1. Descomentar configuración de PostgreSQL remoto en `application.properties`
2. Configurar variables de entorno
3. Desplegar JAR

### Frontend (Vercel, Netlify, GitHub Pages)

1. Actualizar `environment.prod.ts` con URL del backend
2. Build: `ng build --configuration production`
3. Subir carpeta `dist/`

---

## ✅ Checklist de Instalación

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `molinaBDPC1` creada
- [ ] Backend compila sin errores
- [ ] Backend corriendo en `http://localhost:8080`
- [ ] Frontend instalado (npm install)
- [ ] Frontend corriendo en `http://localhost:4200`
- [ ] Usuario de prueba creado
- [ ] Login exitoso
- [ ] Dashboard carga correctamente
- [ ] Conexiones funcionan
- [ ] Mensajes se envían
- [ ] Persistencia verificada

---

## 📞 Contacto y Soporte

Si tienes problemas con la instalación:

1. **Verifica los logs** del backend y frontend
2. **Revisa la consola** del navegador (F12)
3. **Verifica las versiones** de Node, Java, PostgreSQL
4. **Limpia y reinstala** dependencias si es necesario

---

**¡Listo para usar ConnectED! 🚀**
