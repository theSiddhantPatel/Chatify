FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy full project
COPY . .

# Build frontend
RUN cd frontend && npm run build

ENV NODE_ENV=production

WORKDIR /app/backend

EXPOSE 3000

CMD ["npm", "start"]
