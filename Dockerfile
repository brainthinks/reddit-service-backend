FROM node:lts-alpine AS base

COPY ./docker-entrypoint.sh /
ENTRYPOINT [ "/docker-entrypoint.sh" ]

WORKDIR /opt/reddit-service-backend

# Stage: development ----------------------------------------------------------
FROM base as development

CMD ["npx", "ts-node-dev", "--respawn", "src/index.ts"]

# Stage: default --------------------------------------------------------------
FROM base

COPY . .

RUN yarn
RUN npx tsc

EXPOSE 3000
CMD ["node", "./build/index.js"]
