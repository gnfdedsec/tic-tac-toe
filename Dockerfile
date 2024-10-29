# Base image
FROM node:18-alpine

# Install dependencies for Sharp (ถ้ามีการใช้)
RUN apk add --no-cache make g++ vips-dev 

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project files
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Set environment variables with default values
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NODE_ENV=production

# Start application
CMD ["pnpm", "start"]
