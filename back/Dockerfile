
FROM node:14

WORKDIR /usr/src/versatime

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80 27017

CMD [ "node", "index.js" ]