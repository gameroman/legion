FROM node:20

WORKDIR /usr/src/app

COPY matchmaker/package*.json ./

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start"]
# CMD ["tail", "-f", "/dev/null"]
