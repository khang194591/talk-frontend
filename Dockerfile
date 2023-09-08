FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.3-alpine as production

WORKDIR /user/share/nginx/html

RUN rm -rf ./*

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist .

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80