#1 Angular

FROM node AS builder

WORKDIR /app

COPY . /app

RUN npm install && npm run build

#2 nginx

FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
