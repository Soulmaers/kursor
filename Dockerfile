# Используйте официальный образ Node.js в качестве базового
FROM node:14

# Установите рабочую директорию
WORKDIR /usr/src/app

# Скопируйте package.json и package-lock.json
COPY package*.json ./

# Установите зависимости
RUN npm install

# Скопируйте все файлы проекта в контейнер
COPY . .

# Откройте порт 3335
EXPOSE 3335

# Команда для запуска вашего приложения
CMD ["node", "index.js"]