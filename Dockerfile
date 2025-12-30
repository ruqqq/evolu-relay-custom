FROM node:22-alpine AS builder

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# --- Production stage ---
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 evolu --ingroup nodejs && \
    mkdir -p /app/data && \
    chown -R evolu:nodejs /app

USER evolu

VOLUME ["/app/data"]
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const net=require('net');const s=net.connect(process.env.PORT||4000,'127.0.0.1',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1))"

CMD ["node", "src/index.js"]
