FROM oven/bun:1.3.6

WORKDIR /usr/src/app

COPY matchmaker/package.json ./
COPY matchmaker/bun.lock ./

# Copy all config files (nodemon, tsconfig, etc.)
COPY matchmaker/*.json ./
COPY matchmaker/*.js ./
COPY matchmaker/*.env ./

RUN bun install

EXPOSE 3000

# Use Bun's built-in watch mode instead of nodemon for better compatibility
CMD ["bun", "--watch", "--tsconfig-override", "tsconfig.docker.json", "src/matchmaker.ts"]
