FROM node:latest
LABEL maintainer="melvinodsa@gmail.com"

# go get the dependencies and clone the repo
COPY . /app
WORKDIR /app
RUN cd /app \
    && npm install \
    && cp .example.env .env

EXPOSE 9090/tcp
EXPOSE 9090/udp

ENTRYPOINT ["npm", "run", "dev"]