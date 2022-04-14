FROM node:8.10.0-slim
MAINTAINER Shopflix

RUN mkdir -p /app
COPY ./ /app

WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

ENV NODE_ENV=production

RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
