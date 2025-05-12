
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

## Использование Docker Compose

Для запуска с помощью Docker Compose используйте команду:

```bash
docker-compose up
```

Для запуска в фоновом режиме:

```bash
docker-compose up -d
```

### Сохранение данных на Windows

В файле `docker-compose.yml` уже настроено сохранение данных во внешнюю папку на Windows по пути `D:/pocket-link/data`. Убедитесь, что эта папка существует, или создайте её перед запуском:

```
mkdir D:\pocket-link\data
```

Docker автоматически преобразует пути Windows в нужный формат. При работе с Docker Desktop на Windows путь `D:/pocket-link/data` (с прямыми слешами) будет правильно подключен к контейнеру.

## Остановка контейнеров

```bash
docker-compose down
```

## Советы по развертыванию

- Для продакшн окружения рекомендуется настроить HTTPS с помощью обратного прокси, например, Nginx или Traefik
- При работе с Docker на Windows убедитесь, что в Docker Desktop включено совместное использование диска D:
  1. Откройте настройки Docker Desktop
  2. Перейдите в раздел "Resources" > "File sharing"
  3. Убедитесь, что диск D: добавлен в список общих ресурсов
