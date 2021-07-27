FROM node:current-alpine3.14 
WORKDIR /opt 
COPY src src 
COPY babel.config.js babel.config.js
COPY package.json package.json 
RUN yarn install --production=true
  