FROM node:20

WORKDIR /usr/src/app

COPY client/*.json ./
COPY client/*.js ./
COPY client/*.env ./
COPY client/.babelrc ./

RUN npm install

EXPOSE 8080
CMD ["npm", "run", "start"]
