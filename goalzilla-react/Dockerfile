FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY src/ /app/src/
COPY public/ /app/public/


EXPOSE 3000
CMD npm start