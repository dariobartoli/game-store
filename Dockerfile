FROM node:18
ENV PORT=5353
ENV TOKEN_SIGNATURE=tokenPass
ENV SALT=10
ENV REDIS_TTL=1000
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 1500
CMD [ "node", "src/index.js"]
