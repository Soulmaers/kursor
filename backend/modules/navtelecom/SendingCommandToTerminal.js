const { NavtelecomResponceData, CheckSumm, BitsCount, WriteFile } = require('./Helpers');


class SendingCommandToTerminal {
    constructor(socket) {
        this.socket = socket
    }



    answer(preamble, receiver, sender, msg) {
        this.handshake(preamble, receiver, sender, msg)
    }

    responces(msg) { //отправка команд на терминал
        const writeSuccessful = this.socket.write(this.responce);
        if (writeSuccessful) {
            console.log(`${msg}`);
        }
    }

    handshake(preamble, receiver, sender, msg) {
        const message = NavtelecomResponceData.assemblingMSG(msg)
        this.responce = NavtelecomResponceData.bufferAssembly(preamble, receiver, sender, message)
        this.responces('Команда отправлена')
    }
}



module.exports = SendingCommandToTerminal