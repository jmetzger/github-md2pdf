# specify the node base image with your desired version node:<version>
FROM node:slim
RUN apt-get update && apt-get install git -y vim
