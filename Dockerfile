FROM node:9
WORKDIR /home/node
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "index.js"]
