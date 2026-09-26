# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .

# Public build-time configuration (baked into the static bundle — never put secrets here)
ARG VITE_API_URL=/api
ARG VITE_SITE_URL=
ARG VITE_GITHUB_URL=
ARG VITE_LINKEDIN_URL=
ARG VITE_EMAIL=
ARG VITE_RESUME_URL=/Rihab-Hamdani-CV.pdf
ARG VITE_PROFILE_PHOTO=/images/profile.jpg
ENV VITE_API_URL=$VITE_API_URL VITE_SITE_URL=$VITE_SITE_URL VITE_GITHUB_URL=$VITE_GITHUB_URL \
    VITE_LINKEDIN_URL=$VITE_LINKEDIN_URL VITE_EMAIL=$VITE_EMAIL VITE_RESUME_URL=$VITE_RESUME_URL \
    VITE_PROFILE_PHOTO=$VITE_PROFILE_PHOTO
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD wget -qO- http://localhost/healthz || exit 1
