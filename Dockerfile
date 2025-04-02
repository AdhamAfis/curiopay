FROM node:20-alpine AS development

# Test trigger for GitHub Actions
WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    openssl-dev \
    && npm install \
    && npx prisma generate

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]