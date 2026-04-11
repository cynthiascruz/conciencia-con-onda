# Conciencia con Onda

## Descripción del Proyecto

Este repositorio contiene el frontend y backend de **Conciencia con Onda**, una plataforma web para mapear y explorar lugares accesibles en Nuevo León. Está diseñada para que cualquier persona pueda encontrar espacios verificados y adaptados para personas con discapacidad o movilidad reducida, en el contexto del **FIFA World Cup 2026 en Monterrey**.

El proyecto sigue una arquitectura cliente-servidor desacoplada, donde el frontend y backend evolucionan de forma independiente bajo un esquema monorepo.

## Tecnologías Utilizadas

El proyecto se construye sobre el stack **MERN moderno**:

- **MongoDB:** Base de datos NoSQL para un modelado de datos flexible. Maneja colecciones de lugares, usuarios, reseñas, categorías y noticias.
- **Express.js:** Framework minimalista para Node.js, encargado de gestionar las rutas y la API REST.
- **React (con Vite):** Biblioteca para la construcción de la interfaz de usuario. Se optó por Vite como herramienta de construcción por su velocidad y HMR optimizado.
- **Node.js:** Entorno de ejecución en el servidor.
- **Tailwind CSS v4:** Sistema de estilos utilitarios integrado directamente como plugin de Vite, sin necesidad de archivo de configuración.
- **Git:** Control de versiones para el seguimiento estructurado del código.

## Guía de Ejecución Local

Para levantar este proyecto en un entorno de desarrollo local, sigue estos pasos. Es necesario tener instalado **Node.js** y **Git**.

**1. Clonar el repositorio**
```bash
git clone https://github.com/TU_USUARIO/conciencia-con-onda.git
cd conciencia-con-onda
```

**2. Configuración y ejecución del Servidor (Backend)**
```bash
cd backend
npm install

# Crear el archivo de entorno basado en el ejemplo
cp .env.example .env

# Iniciar el servidor en modo desarrollo
npm run dev
```

**3. Configuración y ejecución del Cliente (Frontend)**

En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```

## Decisiones Técnicas y Buenas Prácticas

1. **Estructura Monorepo (Separación de intereses):** Se crearon directorios raíz distintos (`/frontend` y `/backend`). Esto evita conflictos de dependencias, facilita el entendimiento del proyecto y permite despliegues independientes.

2. **Protección de Credenciales:** Se implementó un archivo `.gitignore` desde el primer commit. Las carpetas `node_modules` y archivos `.env` nunca se exponen en el historial. Se provee un `.env.example` como plantilla segura.

3. **Adopción de Vite:** Se seleccionó Vite en lugar de Create React App por sus tiempos de arranque instantáneos y HMR optimizado, siendo el estándar profesional actual.

4. **Tailwind CSS v4:** Se integra como plugin de Vite sin necesidad de `tailwind.config.js`, resultando en una configuración más limpia y mantenible.

5. **Preparación para Arquitectura MVC:** El backend cuenta con la estructura de directorios (`controllers`, `models`, `routes`, `config`) lista para implementar el patrón MVC, garantizando que el código escale de forma ordenada.

6. **Flujo de moderación de contenido:** Los lugares propuestos por usuarios pasan por revisión del administrador antes de publicarse, asegurando la calidad y veracidad de la información.

## Equipo

| Nombre | Rol |
|---|---|
| **Cynthia Sustaita Cruz** | Frontend |
| **Enrique Pozos González** | Backend |
