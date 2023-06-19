

const wialon = require('wialon');

exports.login = async (token) => {
    console.log(token)
    const session = wialon().session;
    try {
        await session.start({ token: token });
        return session;
    } catch (error) {
        console.log(error);
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