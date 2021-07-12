#Using multi-stage build to remove unneccessary files and minimize size of image

FROM node:14-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY .env .
COPY --from=builder /usr/src/app/src .
RUN npm install --only=production
RUN apk add --update openjdk8 gcc g++ python3
ENV JAVA_HOME=/usr/lib/jvm/default-jvm \
    PATH="/usr/lib/jvm/default-jvm/bin:$PATH"
EXPOSE 4004:4004
CMD node app