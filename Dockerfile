FROM node:20-alpine

WORKDIR /app

#ENV DATABASE_URL=postgresql://dotnovi:devops123@host.docker.internal:5432/dotnovi

RUN addgroup -g 1001 nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

USER nodejs

EXPOSE 3000

CMD ["node", "src/index.js"]