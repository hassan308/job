# Base stage för byggmiljön
FROM node:18-alpine AS builder

# Sätt arbetskatalog
WORKDIR /app

# Kopiera package filer
COPY package*.json ./

# Installera dependencies
RUN npm ci

# Kopiera resten av applikationen
COPY . .

# Bygg applikationen
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Sätt till production
ENV NODE_ENV production

# Lägg till non-root användare
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiera nödvändiga filer från builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Sätt korrekta rättigheter
RUN chown -R nextjs:nodejs /app

# Byt till non-root användare
USER nextjs

# Exponera port
EXPOSE 3000

# Starta applikationen
CMD ["node", "server.js"] 