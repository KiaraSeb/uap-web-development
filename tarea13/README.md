# Proyecto: Chatbot  

## Descripción 
Contiene la implementación de un chatbot desarrollado con el framework Next.js (App Router) usando el SDK de Vercel AI y el proveedor LLM OpenRouter.  

## 🛠 Tecnologías usadas  
- Next.js (App Router, Server & Client Components)  
- React (hooks, client components)  
- Tailwind CSS + variables de tema claro/oscuro  
- Vercel AI SDK (integración LLM)  
- OpenRouter (proveedor del modelo LLM)  
- DOMPurify (sanitización de inputs HTML)  
- UUID (generación de IDs de mensajes)  
- Zustand u otro estado local (hooks personalizados)  
- Express / SQLite (enlace con backend, según integración futura)  


## 📁 Estructura principal  
tarea13/
├─ app/
│ ├─ layout.tsx
│ ├─ page.tsx
│ ├─ globals.css
│ └─ api/
│ └─ chat/
│ └─ route.ts
├─ components/
│ ├─ Chat.tsx
│ ├─ MessageItem.tsx
│ └─ InputBox.tsx
├─ hooks/
│ └─ useChat.ts
├─ types/
│ └─ index.ts
├─ tailwind.config.ts
├─ postcss.config.(cjs|mjs)
└─ tsconfig.json


## ⚙️ Configuración inicial  
1. Clona el repositorio (rama `chatBot`):  
   git clone -b chatBot https://github.com/KiaraSeb/uap-web-development.git
   cd uap-web-development/tarea13

- Instala dependencias:
npm install

- Crea el archivo .env.local con las siguientes variables (no commitear):
OPENROUTER_API_KEY=sk-or-v1-tu-apikey
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=anthropic/claude-3-haiku

## Inicia el servidor en modo desarrollo:
npm run dev
Abre en navegador: http://localhost:3000

