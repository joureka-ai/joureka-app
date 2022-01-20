FROM node:16

ENV PORT 3000
ENV NODE_ENV=production

# Installing dependencies
COPY package*.json /usr/src/app/
WORKDIR /usr/src/app

RUN npm install


# Copying source files
COPY . /usr/src/app

# Building app
RUN npm run build
EXPOSE 3000

# Running the app
CMD "npm" "run" "prod"


