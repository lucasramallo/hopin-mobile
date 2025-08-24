# Guia Rápido

## Subir Backend

Projeto disponivel em: https://github.com/lucasramallo/hopin-daw2

## 1. Subir os serviços com Docker Compose
Antes de rodar a aplicação, é necessário subir os containers definidos no `docker-compose.yml` (ex: banco de dados).

```bash
docker compose up -d
```

Isso irá inicializar os serviços necessários em segundo plano.

## 2. Rodar a aplicação Spring Boot
Com os containers rodando, você pode subir a aplicação Spring Boot. Existem duas formas:

### Via Maven
```bash
./mvnw spring-boot:run
```

Se tudo deu certo, a aplicação estará rodando 🚀
