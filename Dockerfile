# Define build arguments
ARG NODE_VERSION=23.10.0

# Stage 1: Builder
FROM node:${NODE_VERSION}-bookworm-slim AS builder

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/projects

# Copy package projects separately to leverage caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Build the project
RUN npm run build

# Create a non-root user
RUN useradd --system --create-home --shell /usr/sbin/nologin projects

# Change ownership of the project
RUN chown -R projects:projects /usr/src/projects

# Set permissions
USER projects

# Set environment variables
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["npm run start -- --hostname=$HOSTNAME --port=$PORT"]
