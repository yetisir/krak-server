FROM node:14.2-stretch

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
#RUN npm install

COPY . ./

CMD npm run serve
