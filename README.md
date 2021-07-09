# CollabCode API #

Server side coding for CollabCode web. Docker containerized application running on [heroku](https://collab-code-api.herokuapp.com/) .

- Features
    - Dokcerized Application , Easy to host as the server requires dependencies like gcc, g++, jdk8 and python3.
    - Socket.io library supports real-time data share.
    - Supports code execution on server thanks to compile-run library on npm and docker. 

- ## Running on your machine ##
    - ```bash
        git clone https://github.com/ssrajputtheboss/collab-code-api.git 
        ```
    - create an empty folder files and also create a .env file and write following properties:
        - ADMIN_SECRET : secret key to encode admin jwt
        - PORT : server will listen on this port
        - SECRET : secret key for encrypting jwt of users
        - DATABASE_URL :your mongodb database url
    - Building Application
        - Run docker build command if you want to use a containerized application. Use Dockerfile for building image with npm build step or use Dockerfile-old(rename to Dockerfile before use) to build image without npm build step.
            ```bash
            docker build -t your-app-name .
            ```
        - To run on yout machine make sure you have installed gcc,g++,python/python3 and jdk. Run following commands to run server.
            ```bash
            yarn install
            yarn build
            yarn start 
            ```
