FROM node:alpine

RUN mkdir /app && mkdir /app/data

WORKDIR /app

ADD package.json yarn.lock /app/

RUN yarn install

#ADD components /app/components
ADD pages /app/pages
ADD server /app/server
#ADD static /app/static

RUN [ "npm", "run", "build" ]

EXPOSE 80

CMD [ "node", "server/server.js" ]

