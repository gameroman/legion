FROM node:20

WORKDIR /usr/src/app

COPY matchmaker/package*.json ./

RUN npm install

RUN npm install -g nodemon

# COPY matchmaker/ ./
# COPY shared ./shared

EXPOSE 3000
CMD ["npm", "run", "start"]
# CMD ["tail", "-f", "/dev/null"]
