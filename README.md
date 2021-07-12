# CollabCode API #

Server side coding for CollabCode web. Docker containerized application running on [heroku](https://collab-code-api.herokuapp.com/) .

- Features
    - Dokcerized Application , Easy to host as the server requires dependencies like gcc, g++, jdk8 and python3.
    - Socket.io library supports real-time data share.
    - Supports code execution on server thanks to compile-run library on npm and docker. 
    - MVC software pattern

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
        - Run docker build command if you want to use a containerized application. Use Dockerfile-mid for building image with npm build step or use Dockerfile-old(rename to Dockerfile before use) to build image without npm build step. Use Dockerfile for building minimized image.
            ```bash
            docker build -t your-app-name .
            ```
        - To run on yout machine make sure you have installed gcc,g++,python/python3 and jdk. Run following commands to run server.
            ```bash
            yarn install
            yarn build
            yarn start 
            ```
            
## Building with Docker ##

There are 3 different dockerfiles each of them has different build size and also update size(update size is when you are making changes to existing image and replacing it with a newer version.). Use of Dockerfile is preffered over Dockerfile-mid and Dockerfile-old , it has both the minimum image size and minimum update size.

| Dockerfile-name | Image size on build | update size |
| --------------- | ------------------- | ----------- |
| Dockerfile-old  | ~593mb              | ~400mb      |
| Dockerfile-mid  | ~502mb              | ~400mb      |
| Dockerfile      | ~492mb              | ~40mb       |
