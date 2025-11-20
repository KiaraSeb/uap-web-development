# Tarea 13: Chatbot con IA y Gestión de Tareas

Esta carpeta corresponde a la **Tarea 13** del proyecto de desarrollo web, implementada en la rama `chatBot`.  
El objetivo es construir un **chatbot basado en IA** que permite gestionar tareas (crear, actualizar, eliminar, buscar) mediante un modelo de lenguaje, herramientas (tools) y una interfaz en React/Next.js.

---

## 🧩 Tecnología usada

- **Next.js** (App Router / rutas de servidor)  
- **AI SDK (`ai`) + OpenRouter** como backend de IA  
- **Prisma ORM** con SQLite (archivo `dev.db` dentro de esta carpeta) para persistencia de tareas  
- **TypeScript** para tipado fuerte  
- Librerías auxiliares: `zod` para validación, `lucide-react` para iconos, etc.

---

## 📁 Estructura de la carpeta

tarea13/
├─ app/
│ ├─ api/
│ │ └─ chat/
│ │ └─ route.ts ← Endpoint streaming para el chatbot
│ ├─ components/
│ │ └─ Mensaje.tsx ← Componente de mensaje (usuario/assistant)
│ └─ … (otras carpetas de UI)
├─ lib/
│ └─ tools.ts ← Definición de herramientas (createTask, updateTask, etc.)
├─ prisma/
│ ├─ schema.prisma ← Esquema de datos de Prisma (tarea, etc.)
│ └─ prisma.config.ts ← Configuración para SQLite
├─ .env.local (no versionado) ← Variables de entorno necesarias
└─ README.md ← Este archivo

---

## 🚀 Configuración y uso

1. Clona el repositorio y cambia a la rama `chatBot`:

   git clone https://github.com/KiaraSeb/uap-web-development.git
   cd uap-web-development
   git checkout chatBot

Instala las dependencias:
npm install

Crea un archivo .env.local en la raíz del proyecto (o dentro de tarea13/ si así lo prefieres) con las siguientes variables:

OPENROUTER_API_KEY=tu_clave_openrouter
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1     
OPENROUTER_MODEL=anthropic/claude-3-haiku              

Asegúrate también de que prisma.config.ts apunte a:
connectionString: "file:./tarea13/dev.db"

Genera el cliente de Prisma y sincroniza la base de datos:

npx prisma generate
npx prisma db push

Inicia el servidor de desarrollo:
npm run dev

Abre tu navegador en http://localhost:3000 y comienza a usar el chat.

## 🛠 Funcionalidades principales
Enviar mensajes al chatbot y recibir respuestas en streaming.

Crear nuevas tareas mediante conversación natural (ej: “Agrega una tarea: Comprar leche”).

Actualizar/Eliminar/Buscar tareas usando comandos en lenguaje natural que activan herramientas definidas en tools.ts.

Visualizar lista de tareas actuales y estadísticas de productividad.

Persistencia local vía SQLite (tarea13/dev.db).

## 📋 Consideraciones
Asegúrate de no exponer tu clave de API (OPENROUTER_API_KEY) en el frontend ni en repositorios públicos.

Para producción, considera cambiar SQLite por una base de datos gestionada (PostgreSQL, MySQL, etc.).

Las herramientas (tools) están definidas para: createTask, updateTask, deleteTask, searchTasks, getTaskStats. Puedes extenderlas según necesidad.

El frontend renderiza correctamente bloques de código (```) y texto normal, sin borrar contenido.

El endpoint maneja «rate limiting» básico por IP para evitar abusos.

## 🧠 ¿Cómo funciona técnicamente?
El cliente envía un POST a /api/chat con el array de mensajes (roles + contenido).

El servidor limpia / sanitiza la entrada, verifica que haya contenido, luego llama streamText() con el modelo de OpenRouter, las herramientas, etc.

El resultado del stream se envía de vuelta como text/event-stream al cliente.

El cliente los va leyendo, acumula el texto y actualiza el estado para mostrar la conversación.

Si el mensaje de respuesta contiene JSON con "tasks": [...] o "summary": {...}, el hook lo detecta y actualiza la lista de tareas y estadísticas.

