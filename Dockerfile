FROM node:alpine

RUN mkdir /app && mkdir /app/data

WORKDIR /app

ADD package.json yarn.lock /app/

RUN yarn install

ADD . /app/

RUN [ "yarn", "run", "build" ]

EXPOSE 80

CMD [ "node", "server/server.js" ]

