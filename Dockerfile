FROM node:20-bookworm-slim
WORKDIR /app
COPY package*.json ./
# python3/make/g++ are only needed if no prebuilt better-sqlite3 binary is available
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ wget ca-certificates \
    && (npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund) \
    && rm -rf /var/lib/apt/lists/*
COPY . .
RUN mkdir -p data uploads && chown -R node:node /app
USER node
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
