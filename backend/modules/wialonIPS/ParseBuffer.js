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

    /*  create(messageType, messageBody) {
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
      }*/
    socketOn() {
        this.socket.on('data', async (data) => {
            console.log('датаIPS')
            this.buffer.push(data);
        })
        this.socket.on('end', () => {
            console.log('энд')
            let data = Buffer.concat(this.buffer);
            console.log(data)
            let buf = data.toString()
            // console.log(buf)
            const message = buf.toString()
            console.log(message)
            const validateReqExp = /#(?<type>L|D|P|SD|B|M|I)#(?<message>.*)\n/gm;

            const matches = message.matchAll(validateReqExp);

            /*const messages = matches.map(match => {
                return {
                    type: match.groups.type,
                    message: match.groups.message,
                };
            });
            console.log(messages)*/
            //  const type = res.groups.type;
            //   const messages = res.groups.message;
            //  console.log(type, messages)
            let messageType, messageBody;

            /*const validate = [...message.matchAll(validateReqExp)];
            messageType = validate[0]['groups']['type'];
            messageBody = validate[0]['groups']['message'];

            console.log(messageType)
            console.log(messageBody)
            //  this.create(messageType, messageBody)*/


        })
        this.socket.end();

    }
}

module.exports = ListenPortIPS