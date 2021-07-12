# build stage
FROM node:10.16-alpine as build-stage

# Create app folder
RUN mkdir /app
WORKDIR /app

# Copy all files to app folder
COPY package*.json ./
RUN npm install --progress=false
COPY . /app
# Environment app
ARG VUE_APP_SECURE
ARG VUE_APP_URL
ARG VUE_APP_PORT
ENV VUE_APP_SECURE $VUE_APP_SECURE
ENV VUE_APP_URL $VUE_APP_URL
ENV VUE_APP_PORT $VUE_APP_PORT
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
