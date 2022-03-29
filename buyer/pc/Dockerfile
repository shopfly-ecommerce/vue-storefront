# 注意：请在ui目录下执行build命令
# 例如：docker build -t buyer-pc:v1 -f ./buyer/pc/Dockerfile .

FROM node:8.10.0-slim
MAINTAINER Javashop

RUN mkdir -p /ui/buyer/pc
RUN mkdir -p /ui/ui-domain
RUN mkdir -p /ui/ui-utils
COPY ./buyer /ui/buyer
COPY ./ui-domain /ui/ui-domain
COPY ./ui-utils /ui/ui-utils

WORKDIR /ui/buyer/pc

RUN npm install --registry=https://registry.npm.taobao.org

ENV NODE_ENV=production

RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
