FROM node:8.10.0-alpine

RUN mkdir -p /app

WORKDIR /app

COPY .env /app/.env

ADD package.json /app/package.json

ADD . /app

RUN yarn --pure-lockfile

RUN yarn install

RUN yarn add node-sass --unsafe-perm

EXPOSE 3000

CMD [ "yarn", "start" ]

## base image
# FROM node:12.2.0-alpine

## set working directory
# WORKDIR /app

## add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

## install and cache app dependencies
# COPY package.json /app/package.json
# RUN yarn add
# start app
# CMD ["yarn", "start"]