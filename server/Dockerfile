FROM node:20

WORKDIR /usr/src/app

COPY server/*.json ./
COPY server/*.js ./
COPY server/*.env ./

RUN npm install

EXPOSE 3123
CMD ["npm", "run", "dev"]
