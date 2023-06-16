

const wialon = require('wialon');

exports.login = async (token) => {
    const session = wialon().session;
    try {
        await session.start({ token: token });
        return session;
    } catch (error) {
        console.log(error);
    }
};

