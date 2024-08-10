FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

ENV PORT=3000
EXPOSE ${PORT}

# Copy the initialization script
COPY mariadb/maria-init.sh /docker-entrypoint-initdb.d/

# Ensure the script is executable
RUN chmod +x /docker-entrypoint-initdb.d/maria-init.sh
CMD ["npm", "setup"]
CMD ["npm", "start"]