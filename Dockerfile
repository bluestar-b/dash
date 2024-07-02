FROM nginx:alpine

WORKDIR /app

COPY ./dashw/ /app

RUN apk add --no-cache nodejs npm

# Install pnpm
RUN npm i -g pnpm


RUN pnpm install && \
    pnpm run build

RUN cp -r /app/dist/ /usr/share/nginx/html/

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

