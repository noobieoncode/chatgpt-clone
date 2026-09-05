# ChatGPT Clone

Production-ready full-stack ChatGPT clone with authentication, conversation history, message editing/deletion, and real-time streamed AI responses.

## Tech Stack

- **Frontend:** React 18+, Axios, TailwindCSS, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JWT
- **AI:** OpenAI Chat Completions API (streaming)

## Project Structure

```
chatgpt-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── .env.example
├── frontend/
│   ├── src/
│   └── .env.example
└── README.md
```

## Features

- Modern dark responsive chat UI
- Conversation history sidebar
- Signup/login authentication flow
- JWT-protected backend routes
- Real-time token streaming from OpenAI
- Typing indicator while streaming
- Create/delete conversations
- Edit/delete messages
- Copy messages to clipboard
- Rate limiting and CORS configuration
- Validation and centralized error handling

## Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set these environment variables in `backend/.env`:

- `PORT` (default `5000`)
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default `gpt-4o-mini`)
- `CLIENT_ORIGIN` (default `http://localhost:5173`)

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Set frontend env:

- `VITE_API_BASE_URL` (default `http://localhost:5000/api`)

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/:conversationId`
- `DELETE /api/conversations/:conversationId`
- `PUT /api/conversations/:conversationId/messages/:messageId`
- `DELETE /api/conversations/:conversationId/messages/:messageId`
- `POST /api/conversations/:conversationId/messages` (SSE stream)

## Build

```bash
cd frontend && npm run build
```

The backend is a Node service (`npm start` / `npm run dev`) and should run behind proper production process management.
