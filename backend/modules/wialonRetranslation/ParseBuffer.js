const net = require('net');
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
const { UpdateSetStor } = require('../dataProcessorModule/class/UpdateSetStor.js')

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
        this.arrayData = []
    }


    socketOn() { //расшифровка буффера пакетов сообщений
        this.socket.on('data', async (data) => {
            //   console.log(data)
            this.buffer.push(data);
        })
        this.socket.on('end', async () => {
            console.log('энд')
            const data = Buffer.concat(this.buffer);
            let buf = data
            this.allData['port'] = this.port
            const size = buf.readInt32LE()
            buf = buf.slice(4)
            const imei = buf.slice(0, 15).toString()
            this.imei = imei
            console.log(imei)
            this.allData['imei'] = this.imei
            buf = buf.slice(16)
            const time = buf.readUInt32BE()
            this.allData['time'] = time
            buf = buf.slice(4)
            const mask = buf.readUInt32BE()
            buf = buf.slice(4)
            this.parse(buf)
            const res = await databaseService.objectsImei(String(this.imei))
            if (res.length !== 0) {
                new UpdateSetStor(this.imei, this.port, this.arrayData, res[0].idObject)
                this.setValidationImeiToBase()
            }
        })
        this.socket.end();
    }


    async setValidationImeiToBase(id) { //валидация на наличие заведенного объекта с IMEI
        this.allData['idObject'] = id
        const table = 'wialon_retranslation'
        const base = new JobToBase()
        await base.createTable(table)
        await base.fillingTableColumns(this.allData, table)
        await base.fillingTableRows(this.allData, table)
        console.log('Протокол wialon R -даные сохранены в БД')
    }
    parse(buf) {
        if (buf.length === 0) {
            this.arrayData.push(this.allData)
            return
        }
        const blockLine = buf.readUInt16BE()
        blockLine === 3003 ? buf = buf.slice(2) : (this.arrayData.push(this.allData), buf = buf.slice(30))
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