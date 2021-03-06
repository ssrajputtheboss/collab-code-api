#Using multi-stage build to remove unneccessary files and minimize size of image

FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install
RUN npm run build

FROM ssrajputtheboss/node-pggj:1.0
WORKDIR /usr/src/app
COPY package.json ./
COPY .env .
COPY --from=builder /usr/src/app/src .
RUN npm install --only=production
EXPOSE 4004:4004
CMD node app