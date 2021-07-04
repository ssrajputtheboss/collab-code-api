FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .env .
RUN npm install
COPY . .
EXPOSE 4000:4000
CMD npm run dev