FROM php:8.2-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y git unzip libpq-dev libzip-dev zip curl && docker-php-ext-install pdo pdo_pgsql zip bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

EXPOSE 9000

CMD ["php-fpm"]
