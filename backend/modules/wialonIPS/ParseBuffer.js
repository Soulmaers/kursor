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
        this.socketOn()
        this.buf = null
        this.imei = null
        this.allData = {}
    }


    socketOn() {
        this.socket.on('data', async (data) => {
            console.log('датаIPS')
            this.buffer.push(data);
        })
        this.socket.on('end', () => {
            console.log('энд')
            let data = Buffer.concat(this.buffer);
            console.log(data)
            let buf = data
            buf = buf.slice(1)
            console.log(buf)
            const packetType = buf.slice(0, 1).toString()
            console.log(packetType)
            buf = buf.slice(2)
            const delimiterIndex = buf.indexOf(0x3b);
            const imei = buf.slice(0, delimiterIndex).toString()
            buf = buf.slice(delimiterIndex);
            console.log(imei)
            console.log(buf)
            //  let count = 0
            //  const proto = buf.slice(count, count + 1).toString() !== ';' ? (count++, buf.slice(count, count + 1).toString()) : buf.slice(0, count)
            //  buf.slice(count)
            //  console.log(proto)
            console.log(buf)
        })
        this.socket.end();
    }

}


module.exports = ListenPortIPS