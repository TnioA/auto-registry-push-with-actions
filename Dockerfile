FROM node:bullseye-slim

WORKDIR /app

COPY . .

EXPOSE 5000

CMD [ "node", "./index.js" ]