FROM php:8.4-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    ca-certificates \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring bcmath zip gd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY backend/ .
COPY nginx/render.conf.template /etc/nginx/render.conf.template

RUN composer install --no-dev --optimize-autoloader \
    && chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && php artisan storage:link || true

EXPOSE 8000

CMD sh -c "sed \"s/__PORT__/\${PORT:-8000}/g\" /etc/nginx/render.conf.template > /etc/nginx/sites-available/default && php artisan config:cache && php artisan migrate --force && php-fpm -D && nginx -g 'daemon off;'"
