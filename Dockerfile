FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm i -g pnpm
RUN pnpm install --registry=https://registry.npmmirror.com && pnpm run build
CMD pnpm run start
EXPOSE 3000
