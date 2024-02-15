const { net } = require('../../../index')
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
class ListenPortTPNew {
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
            console.log('дата')
            this.buffer.push(data);
        })
        this.socket.on('end', () => {
            console.log('энд')
            this.buf = Buffer.concat(this.buffer);
            console.log(this.buf)
            let buf = this.buf
            this.allData['port'] = this.port
            const size = buf.readInt32LE()
            buf = buf.slice(4)
            const imei = buf.slice(0, 15).toString()
            this.imei = imei
            this.allData['imei'] = this.imei
            buf = buf.slice(16)
            const time = buf.readUInt32BE()
            this.allData['time'] = time
            buf = buf.slice(4)
            const mask = buf.readUInt32BE()
            buf = buf.slice(4)
            this.parse(buf)
            this.setValidationImeiToBase()
        })
        this.socket.end();
    }


    async setValidationImeiToBase() {
        const res = await databaseService.objectsImei(String(this.imei))
        if (res) {
            this.allData['idObject'] = res[0].idObject
            const table = 'wialon_retranslation'
            const base = new JobToBase()
            await base.createTable(table)
            await base.fillingTableColumns(this.allData, table)
            await base.fillingTableRows(this.allData, table)
            console.log('Протокол wialon R -даные сохранены в БД')
        }
    }
    parse(buf) {
        if (buf.length === 0) {
            return
        }
        const blockLine = buf.readUInt16BE()
        buf = buf.slice(2)
        const sizeBlock = buf.readUInt32BE()
        buf = buf.slice(4)
        const atributeHidden = buf.readUInt8()
        buf = buf.slice(1)
        const typeBlock = buf.readInt8()
        buf = buf.slice(1)
        let nameBlock;
        let value;
        switch (typeBlock) {
            case 1:
                const result = buf.slice(0, (sizeBlock - 3)).toString().split('\x00');
                nameBlock = result[0]
                value = result[1]
                buf = buf.slice((sizeBlock - 2))
                this.allData[nameBlock] = value
                this.parse(buf)
                break;
            case 3:
                nameBlock = buf.slice(0, (sizeBlock - 7)).toString()
                buf = buf.slice((sizeBlock - 6))
                value = buf.readUInt32BE()
                buf = buf.slice(4)
                this.allData[nameBlock] = value
                this.parse(buf)
                break;
            case 2:
                nameBlock = buf.slice(0, (sizeBlock - 32)).toString()
                buf = buf.slice((sizeBlock - 31))
                const lon = buf.readDoubleLE()
                buf = buf.slice(8)
                this.allData['lon'] = lon
                const lat = buf.readDoubleLE()
                buf = buf.slice(8)
                this.allData['lat'] = lat
                const alt = buf.readDoubleLE()
                buf = buf.slice(8)
                this.allData['alt'] = alt
                const speed = buf.readUInt16BE()
                buf = buf.slice(2)
                this.allData['speed'] = speed
                const course = buf.readUInt16BE()
                buf = buf.slice(2)
                this.allData['course'] = course
                const satspos = buf.readInt8()
                buf = buf.slice(1)
                this.allData['satspos'] = satspos
                this.parse(buf)
                break;
            case 5:
                nameBlock = buf.slice(0, (sizeBlock - 11)).toString()
                buf = buf.slice((sizeBlock - 10))
                value = Number(buf.readBigInt64BE())
                buf = buf.slice(8)
                this.allData[nameBlock] = value
                this.parse(buf)
                break;
            case 4:
                nameBlock = buf.slice(0, (sizeBlock - 11)).toString()
                buf = buf.slice((sizeBlock - 10))
                value = buf.readDoubleLE()
                buf = buf.slice(8)
                this.allData[nameBlock] = value
                this.parse(buf)
                break;
            default: console.log('тип вне условий'), console.log(sizeBlock, typeBlock)
                break;
        }
    }

}


module.exports = ListenPortTPNew