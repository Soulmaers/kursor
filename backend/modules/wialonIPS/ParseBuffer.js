const { net } = require('../../../index')


class ListenPortIPS {
    constructor(port) {
        this.port = port
        this.createServer(this.port)
    }
    createServer(port) {
        console.log(port)
        const tcpServer = net.createServer((socket) => {
            console.log('TCP Client connected new');
            new ParseBuffer(socket, port)

        })

        tcpServer.listen(port, () => {
            console.log(`TCP протокол слушаем порт ${port}`);
        });
    }
}

class ParseBuffer {
    constructor(socket, port) {
        this.socket = socket
        this.port = port
        this.buffer = [];
        this.allData = {}
        this.socketOn()
        this.buf = null
        this.imei = null

    }

    create(messageType, messageBody) {
        switch (messageType) {
            case 'L':
                const paramsFromMessage = messageBody.split(';');

                this.allData['imei'] = paramsFromMessage[0]
                this.allData['password'] = paramsFromMessage[1]
                const responce = `^#${messageType}#1\r\n`
                console.log(responce)
                this.socket.write(responce);
                //  console.log(this.allData)
                break;
            default:
                break;
        }
    }
    socketOn() {
        this.socket.on('data', async (data) => {

            console.log('датаIPS')
            //  let data = Buffer.concat(this.buffer);
            console.log(data)
            let buf = data
            //  console.log(buf.setEncoding('utf-8'))
            const message = buf.toString()
            /*   const validateReqExp = /^#(?<type>L|D|P|SD|B|M|I)#(?<message>.*)/g;
   
               let messageType, messageBody;
   
               const validate = [...message.matchAll(validateReqExp)];
               messageType = validate[0]['groups']['type'];
               messageBody = validate[0]['groups']['message'];
   
               console.log(messageType)
               console.log(messageBody)
               this.create(messageType, messageBody)*/


            this.socket.on('end', () => {
                console.log('энд')

                this.socket.end();

            })

        })
    }
}

module.exports = ListenPortIPS