FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .env .
RUN npm install
RUN apk add --update openjdk8 gcc g++ python3
ENV JAVA_HOME=/usr/lib/jvm/default-jvm \
    PATH="/usr/lib/jvm/default-jvm/bin:$PATH"
COPY . .
EXPOSE 4004:4004
CMD npm run dev