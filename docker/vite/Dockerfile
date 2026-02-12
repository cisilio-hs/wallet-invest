FROM node:24-alpine

ARG UID
ARG GID

RUN addgroup -g ${GID} appgroup || true \
    && adduser -D -u ${UID} -G appgroup appuser || true

WORKDIR /var/www

USER appuser

CMD ["npm", "run", "dev"]
