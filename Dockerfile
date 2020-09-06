FROM node:14

WORKDIR /app

COPY dist/ /app
COPY yarn.lock .
COPY package.json .
COPY package.json /

RUN cd /app && yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["node", "--enable-source-maps", "./"]