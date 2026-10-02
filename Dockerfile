# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --ignore-scripts
COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm run build

FROM build AS production-dependencies
RUN npm ci --omit=dev --ignore-scripts --offline --no-audit --no-fund

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PTQ_API_HOST=0.0.0.0 PTQ_API_PORT=8787 PTQ_MODE=real
WORKDIR /app
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PTQ_API_PORT+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "apps/backend/dist/index.js"]
