FROM node:21

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Prisma generate
RUN npm run prisma:generate

EXPOSE 3333

CMD [ "npm", "run", "dev"]