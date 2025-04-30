
# Инструкция по использованию Docker с проектом Pocket Link

## Сборка Docker образа

```bash
docker build -t pocket-link .
```

## Запуск Docker контейнера

```bash
docker run -p 8080:80 pocket-link
```

После запуска контейнера приложение будет доступно по адресу http://localhost:8080

## Использование Docker Compose (опционально)

Если вы предпочитаете использовать Docker Compose, создайте файл `docker-compose.yml` со следующим содержимым:

```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "8080:80"
```

Затем запустите:

```bash
docker-compose up
```

## Советы по развертыванию

- Для продакшн окружения рекомендуется настроить HTTPS с помощью обратного прокси, например, Nginx или Traefik
- Для хранения данных ссылок вне контейнера, используйте тома Docker:
  ```bash
  docker run -p 8080:80 -v /path/to/data:/app/data pocket-link
  ```
