
# Используем Node.js образ в качестве базового
FROM node:20-alpine as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Создаем директории для данных и сервера
RUN mkdir -p /app/data
RUN mkdir -p /app/server

# Создаем простой файловый сервер (без использования новых зависимостей)
RUN echo '#!/usr/bin/env node\n\
const http = require("http");\n\
const fs = require("fs");\n\
const path = require("path");\n\
const url = require("url");\n\
\n\
const DATA_DIR = "/app/data";\n\
const LINKS_FILE = path.join(DATA_DIR, "links.json");\n\
const PORT = 3001;\n\
\n\
// Убедимся, что директория существует\n\
if (!fs.existsSync(DATA_DIR)) {\n\
  fs.mkdirSync(DATA_DIR, { recursive: true });\n\
}\n\
\n\
// Убедимся, что файл существует\n\
if (!fs.existsSync(LINKS_FILE)) {\n\
  fs.writeFileSync(LINKS_FILE, JSON.stringify([]), "utf8");\n\
}\n\
\n\
const server = http.createServer((req, res) => {\n\
  // Разрешаем CORS\n\
  res.setHeader("Access-Control-Allow-Origin", "*");\n\
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");\n\
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");\n\
\n\
  // Обрабатываем OPTIONS запрос (для CORS preflight)\n\
  if (req.method === "OPTIONS") {\n\
    res.writeHead(200);\n\
    res.end();\n\
    return;\n\
  }\n\
\n\
  const parsedUrl = url.parse(req.url, true);\n\
  const pathname = parsedUrl.pathname;\n\
\n\
  console.log(`Request received: ${req.method} ${pathname}`);\n\
\n\
  // API для работы с ссылками\n\
  if (pathname === "/api/links") {\n\
    if (req.method === "GET") {\n\
      // Получаем все ссылки\n\
      try {\n\
        console.log(`Reading links from ${LINKS_FILE}`);\n\
        const data = fs.readFileSync(LINKS_FILE, "utf8");\n\
        console.log(`Links data: ${data}`);\n\
        res.writeHead(200, { "Content-Type": "application/json" });\n\
        res.end(data);\n\
      } catch (err) {\n\
        console.error(`Error reading links: ${err.message}`);\n\
        res.writeHead(500, { "Content-Type": "application/json" });\n\
        res.end(JSON.stringify({ error: "Failed to read links" }));\n\
      }\n\
    } else if (req.method === "POST") {\n\
      // Сохраняем ссылки\n\
      let body = "";\n\
      req.on("data", (chunk) => {\n\
        body += chunk.toString();\n\
      });\n\
\n\
      req.on("end", () => {\n\
        try {\n\
          console.log(`Saving links data: ${body}`);\n\
          const data = JSON.parse(body);\n\
          fs.writeFileSync(LINKS_FILE, JSON.stringify(data), "utf8");\n\
          console.log(`Links saved successfully to ${LINKS_FILE}`);\n\
          res.writeHead(200, { "Content-Type": "application/json" });\n\
          res.end(JSON.stringify({ success: true }));\n\
        } catch (err) {\n\
          console.error(`Error saving links: ${err.message}`);\n\
          res.writeHead(500, { "Content-Type": "application/json" });\n\
          res.end(JSON.stringify({ error: "Failed to save links" }));\n\
        }\n\
      });\n\
    } else {\n\
      res.writeHead(405, { "Content-Type": "application/json" });\n\
      res.end(JSON.stringify({ error: "Method not allowed" }));\n\
    }\n\
  } else {\n\
    res.writeHead(404, { "Content-Type": "application/json" });\n\
    res.end(JSON.stringify({ error: "Not found" }));\n\
  }\n\
});\n\
\n\
server.listen(PORT, () => {\n\
  console.log(`API server running on port ${PORT}`);\n\
});\n' > /app/server/api-server.js

# Делаем скрипт сервера исполняемым
RUN chmod +x /app/server/api-server.js

# Собираем приложение
RUN npm run build

# Создаем скрипт запуска напрямую в файле
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node /app/server/api-server.js &' >> /app/start.sh && \
    echo 'nginx -g "daemon off;"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Этап для запуска приложения
FROM nginx:alpine

# Устанавливаем nodejs
RUN apk add --update nodejs

# Создаем директорию для данных приложения
RUN mkdir -p /app/data
RUN mkdir -p /app/server

# Копируем собранное приложение из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/server/api-server.js /app/server/api-server.js

# Явно создаем start.sh в финальном образе
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node /app/server/api-server.js &' >> /app/start.sh && \
    echo 'nginx -g "daemon off;"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Копируем конфигурацию nginx для правильной работы React Router и проксирования API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80
# Открываем порт 3001 для API
EXPOSE 3001

# Запускаем nginx и API сервер
CMD ["/bin/sh", "/app/start.sh"]
