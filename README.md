# Configuración y Ejecución Local

Sigue estos pasos para replicar el entorno de desarrollo en tu máquina local.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

* **Node.js** (Versión 18.0 o superior)
* **npm** (Normalmente viene incluido con Node.js)
* **MySQL Server** (Versión 8.0 o superior)
* **Git** (Para clonar el repositorio)

---

# 1. Configuración de la Base de Datos (MySQL)

1. Abre tu gestor de bases de datos preferido (MySQL Workbench o la terminal de MySQL).

2. Crea una nueva base de datos llamada `speedcuberos`:

```sql
CREATE DATABASE speedcuberos;
```

3. Ejecuta el script SQL de migración ubicado en:

```text
/speedcuberos-backend/database/script.sql
```

Este script creará las siguientes tablas con sus relaciones correspondientes:

* `Usuario`
* `Rol`
* `CategoriaCubo`
* `Competidor`
* `Record`

Además de 2 cuentas por default para usar el sistema.
---

# 2. Configuración del Backend (Node.js + Express)

1. Abre una terminal y navega a la carpeta del backend:

```bash
cd speedcuberos-backend
```

2. Instala todas las dependencias necesarias:

```bash
npm install
```

3. Crea un archivo llamado `.env` en la raíz del backend y agrega la siguiente configuración:

```env
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=speedcuberos
JWT_SECRET=ClaveSecretaSuperSeguraParaLosTokens123
```

4. Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El backend debería ejecutarse correctamente en:

```text
http://localhost:5000
```

---

# 3. Configuración del Frontend (React + Vite)

1. Abre una segunda terminal y navega a la carpeta del frontend:

```bash
cd speedcuberos-frontend
```

2. Instala las dependencias del proyecto:

```bash
npm install
```

3. Verifica que la URL base del frontend apunte correctamente al backend en tu archivo de configuración (`src/config.js` o equivalente):

```javascript
export const API_BASE_URL = 'http://localhost:5000/api';
```

4. Inicia el servidor de desarrollo con Vite:

```bash
npm run dev
```

Vite compilará el proyecto y mostrará una URL local, normalmente:

```text
http://localhost:5173
```

Abre esa dirección en tu navegador.

---

# 4. Cuentas de Prueba para QA

Para evaluar los diferentes flujos del sistema sin necesidad de registrar nuevos usuarios, puedes utilizar las siguientes credenciales de prueba preconfiguradas en la base de datos.

## Cuenta de Administrador (Rol 1)

* **Correo:** `turing@gmail.com`
* **Contraseña:** `Password_123`

## Cuenta de Competidor / Speedcuber (Rol 2)

* **Correo:** `jesus.tlapa11@gmail.com`
* **Contraseña:** `Password_123`

---
