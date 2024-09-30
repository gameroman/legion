FROM node:20

WORKDIR /usr/src/app

COPY matchmaker/*.json ./
COPY matchmaker/*.js ./
COPY matchmaker/*.env ./

RUN npm install

COPY shared/ ./ 

CMD ["npm", "run", "dev"]
# CMD ["tail", "-f", "/dev/null"]
