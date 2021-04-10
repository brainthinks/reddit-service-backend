# Reddit Service - Backend <!-- omit in toc -->

A service to manage users who want the top posts of their favorite subreddits sent to their inbox.


## Table of Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
- [Development](#development)


## Getting Started

1. `docker build -t reddit-service-backend:latest .`
1. `cp .env.example .env`
1. Configure `.env`
1. `docker-compose down && docker-compose up`
1. navigate to [https://localhost](http://localhost)


## Development

1. `docker-compose build`
1. `cp docker-compose.dev.yml docker-compose.override.yml`
1. 1. `cp .env.example .env`
1. Configure `.env`
1. `docker-compose down && docker-compose up`
1. navigate to [https://localhost](http://localhost)
