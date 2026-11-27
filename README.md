# Distribuidora de Gas El Volcán

Proyecto web hecho con React y Vite para administrar y mostrar productos de una distribuidora de gas.

## ¿Qué incluye?

- Catálogo de productos.
- Sección de administración para crear y editar productos.
- Formularios con validaciones básicas.
- Datos guardados en el navegador mediante `localStorage`.
- Pruebas automatizadas con Vitest y React Testing Library.

## Cómo ejecutar el proyecto

Necesitas tener instalado Node.js y npm.

1. Descarga o clona el repositorio.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia la aplicación:

   ```bash
   npm run dev
   ```

5. Abre en el navegador la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

## Comandos útiles

```bash
npm test
npm run test:coverage
npm run lint
npm run build
```

- `npm test`: ejecuta las pruebas.
- `npm run test:coverage`: ejecuta las pruebas y muestra la cobertura.
- `npm run lint`: revisa el código.
- `npm run build`: genera la versión de producción.

## Importante

Los datos se guardan en el navegador usando `localStorage`, así que no se comparten automáticamente entre navegadores o computadores. Si se borran los datos del sitio, los cambios guardados localmente pueden perderse.

## Tecnologías

- React
- Vite
- React Router
- Vitest
- React Testing Library
- Bootstrap

---

Proyecto semestral DSY1104.
