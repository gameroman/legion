FROM oven/bun:1.3.6

WORKDIR /usr/src/app

COPY client/package.json ./
COPY client/bun.lock ./

RUN bun ci

COPY client/electron.js ./
COPY client/preload.js ./

COPY client/*.env ./

COPY client/.babelrc ./

WORKDIR /usr/src/app

EXPOSE 8080

CMD ["bun", "run", "start"]
