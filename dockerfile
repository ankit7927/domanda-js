FROM node:20.17.0

RUN mkdir domanda

RUN npm install pm2 -g

WORKDIR /domanda

COPY . .

RUN npm i

EXPOSE 8000