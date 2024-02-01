

const wialon = require('wialon');

exports.login = async (token) => {
    const session = wialon().session;
    try {
        await session.start({ token: token });
        return session;
    } catch (error) {

        console.error('Ошибка входа:', error);
        return 'ошибка'
        throw error; // Пробрасываем ошибку дальше для обработки
    }

};

/*
exports.logout = async (session) => {
    try {
        await session.stop()
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};*/