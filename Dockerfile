FROM node:18
ENV PORT=5353
ENV TOKEN_SIGNATURE=tokenPass
ENV MONGO_URI=mongodb+srv://dario:741456@cluster0.z1ldbfa.mongodb.net/gameStore?retryWrites=true&w=majority
ENV SALT=10
ENV REDIS_TTL=1000
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 1500
CMD [ "node", "src/index.js"]
