FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
