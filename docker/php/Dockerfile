FROM php:8.5-fpm-alpine

# Receber UID e GID do host
ARG UID
ARG GID

# Dependências do sistema
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    libxml2-dev \
    shadow

# Extensões PHP necessárias
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Criar grupo e usuário com UID/GID do host
RUN addgroup -g ${GID} appgroup \
    && adduser -D -u ${UID} -G appgroup appuser

# Definir diretório de trabalho
WORKDIR /var/www

# Garantir permissões corretas
RUN mkdir -p /var/www \
    && chown -R ${UID}:${GID} /var/www

# Rodar container como usuário não-root
USER appuser

CMD ["php-fpm"]
