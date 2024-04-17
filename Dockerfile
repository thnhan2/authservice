FROM node:20.10.0-alpine
WORKDIR /app
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["yarn", "start"]
