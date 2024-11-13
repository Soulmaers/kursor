
const axios = require('axios');




const MAX_RETRIES = 10; // Максимальное количество попыток

exports.login = async (token) => {
    const url = `https://hst-api.watchit.ru/wialon/ajax.html?svc=token/login&params={"token":${token}}`;
    const headers = {
        'Content-Type': 'application/json'
    };

    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        try {
            const response = await axios.post(url, {}, { headers: headers, timeout: 60000 });
            return response.data
        } catch (error) {
            attempt++;
            console.log(`Attempt ${attempt} failed:`, error.response ? error.response.data : error.message);

            if (attempt >= MAX_RETRIES) {
                return { success: false, error: 'Maximum retry attempts reached' };
            }

            // Рекомендуется добавить небольшую задержку перед повторной попыткой
            await new Promise(resolve => setTimeout(resolve, 5000)); // Задержка 2 секунды
        }
    }
};

