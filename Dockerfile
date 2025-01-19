FROM php:8.1.31

# Instalar Node.js y git
RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs=20.14.0-1nodesource1

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Este es el directorio de trabajo
WORKDIR /app/axol_web

# Copiar el archivo de dependencia y el código fuente al contenedor
COPY package.json package-lock.json /app/axol_web/
COPY composer.json composer.lock /app/axol_web/

# Copy the program code
COPY . .

# Installing dependencies
RUN npm install
RUN composer install

# Copy the custom php.ini
# COPY php.ini /usr/local/etc/php/

# Puerto
EXPOSE 8000
EXPOSE 5173

CMD [ "sh", "-c", "php artisan serve --host=0.0.0.0 & npm run dev" ]