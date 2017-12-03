FROM node:8.9.1-alpine

RUN mkdir /app

WORKDIR /app

ADD package.json yarn.lock /app/

RUN [ "yarn", "install" ]

ADD . /app/

RUN ["yarn", "test"]

RUN [ "yarn", "run", "build" ]

EXPOSE 3000

CMD [ "node", "server/server.js" ]

