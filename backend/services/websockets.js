
const { wss } = require('../../index.js')





module.exports.messAlarm = (value) => {

    wss.on('connection', (ws) => {
        console.log(value)
        // Обработка подключения WebSocket-клиента
        console.log('WebSocket client connected');
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const message = 'Привет, клиент!';
                client.send(value); // Отправляем сообщение клиенту
            }
        });
        // Обработка сообщений от WebSocket-клиента
        ws.on('message', (message) => {
            console.log('Received message:', message);
        });
        // Обработка закрытия соединения WebSocket-клиента
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });
    })
}

