FROM node:14-alpine
USER root
WORKDIR /home/app
COPY package*.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .env .
RUN npm ci --production
RUN npm i typescript -g
RUN npm run build
COPY . .
EXPOSE 4000:4000
CMD node app