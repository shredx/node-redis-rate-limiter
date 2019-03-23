# Rate Limiter uisng Node.js & REDIS

## Intro

This `Rate Limiter` application is a part of the `Episode - 1` of [SharedX](http://shredx.work) organised on Saturday, March 23, 2019 in Noida

This application is using the [Node-API-Template](https://github.com/knaxus/node-api-template). You can read about the codebase structure there.

## How to RUN

- `npm install`
- `npm run dev`

## Gotchas

- Don't forget to create a `.env` file

## Concept

- Create and store users in REDIS
- Provide `Subscription Keys` to the users
  - A user cannot have more than 3 keys
- Each key has usage limit aggisned to it
- Based on the usage the user is blocked from accessing the routes/features

## Components

- REDIS
- Node.js API Service which publishes usages to the REDIS `pub-sub`
- Golang API Service that manages the usages and broadcast the `BLOCK` event
- Node.js API Gateway which blocks the users
  - This service maintains a local cache

### Todos

- [ ] Add link to different services
- [ ] Add list of contributors
- [ ] Dcoumentation for the application
