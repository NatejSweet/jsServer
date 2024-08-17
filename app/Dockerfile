FROM node:21

# Install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
ENV PORT=3000
EXPOSE ${PORT}

# Ensure the script is executable
RUN chmod +x /usr/src/app/entrypoint.sh
CMD ["npm", "start"]