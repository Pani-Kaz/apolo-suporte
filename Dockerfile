FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --omit=dev && npm install --only=dev

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
