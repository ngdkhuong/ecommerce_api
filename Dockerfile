FROM node:10-alpine

RUN mkdir -p /home/node/ecommerce-api/node_modules && chown -R node:node /home/node/ecommerce-api

WORKDIR /home/node/ecommerce-api

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD ["npm", "start"]
