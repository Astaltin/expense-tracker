FROM node:20.17.0-alpine

RUN npm i -g pnpm 

WORKDIR /usr/src/app

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

COPY . .

EXPOSE $PORT 