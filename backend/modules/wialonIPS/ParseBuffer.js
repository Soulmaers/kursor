const net = require('net');
const databaseService = require('../../services/database.service');
const JobToBase = require('../navtelecom/JobToBase')
const { UpdateSetStor } = require('../dataProcessorModule/class/UpdateSetStor.js')

class ListenPortIPS {

    constructor(port) {
        this.port = port
        this.createServer(this.port)
        // this.sendPacket()
        //  this.object = {}


    }
    createServer(port) {
        console.log('тут')
        console.log(port)
        const tcpServer = net.createServer((socket) => {
            //   console.log('TCP Client connected new');
            new ParseBuffer(socket, port)

        })
        tcpServer.listen(port, () => {
            //  console.log(`TCP протокол слушаем порт ${port}`);
        });
    }


}




class ParseBuffer {
    constructor(socket, port) {
        //console.log(socket, port)
        this.socket = socket
        this.port = port
        this.buffer = [];
        // this.allData = {}
        this.arrayData = []
        this.socketOn()
        this.buf = null
        this.imei = null
        //   this.listenPortIPS = listenPortIPS
    }

    sendPacket(message) {
        const packet = `b'#L#863051064960882;NA\r\n`;
        const msg = `b'${message}\r\n`;
        const client = new net.Socket();
        console.log('мы' + ' ' + packet);

        let isMsgSent = false; // Флаг для отслеживания отправки сообщения

        client.connect(20332, '193.193.165.165', () => {
            client.write(packet); // Отправляем пакет
        });

        client.on('data', (data) => {
            console.log('wialon ips: ' + data);
            if (!isMsgSent) { // Проверяем флаг
                console.log(msg)
                client.write(msg);
                isMsgSent = true; // Устанавливаем флаг в true после отправки
            }
            // client.destroy(); // Уничтожаем соединение после получения ответа (если это необходимо)
        });

        client.on('error', (err) => {
            console.error('Connection error: ' + err);
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
    }

    socketOn() { //расшифровка буффера пакетов сообщений
        this.socket.on('data', async (data) => {
            console.log('датаIPS')
            //   console.log(data)
            this.buffer.push(data);
        })
        this.socket.on('end', async () => {
            console.log('энд')
            let data = Buffer.concat(this.buffer);
            let buf = data.toString()

            const message = buf.toString()

            console.log(message)
            const validateReqExp1 = /.*(\r\n|\n)/g;
            const bool = validateReqExp1.test(message); //проверка на конец строки
            if (bool) {
                const validateReqExp = /^#(?<type>L|D|P|SD|B|M|I)#(?<message>.*)/gm;
                const validate = [...message.matchAll(validateReqExp)];
                //console.log(validate)
                //  this.sendPacket(validate[1][0])
                for (const match of validate) {
                    const messageType = match.groups['type']
                    const messageBody = match.groups['message']
                    const allData = {}

                    switch (messageType) {
                        case 'L':
                            const paramsFromMessage = messageBody.split(';');
                            const imei = paramsFromMessage[0]
                            const password = paramsFromMessage[1]
                            this.imei = imei
                            console.log(this.imei)
                            break
                        case 'D':
                            const paramsFromMessageD = messageBody.split(';');
                            if (paramsFromMessageD.length === 10) {
                                this.createObjectDataShort(paramsFromMessageD, allData)
                            }
                            if (paramsFromMessageD.length === 16) {
                                this.createObjectDataLong(paramsFromMessageD, allData)
                            }
                            break
                        case 'B':
                            const paramsFromMessageB = messageBody.split(';');
                            if (paramsFromMessageB.length === 10) {
                                this.createObjectDataShort(paramsFromMessageB, allData)
                            }
                            if (paramsFromMessageB.length === 16) {
                                this.createObjectDataLong(paramsFromMessageB, allData)
                            }
                        case 'SD':
                            const paramsFromMessageSD = messageBody.split(';');
                            this.createObjectDataShort(paramsFromMessageSD, allData)
                            break
                        default:
                            break;
                    }
                    Object.values(allData).length !== 0 ? this.arrayData.push(allData) : null
                    //  this.listenPortIPS.object = allData
                }
                const res = await databaseService.objectsImei(String(this.imei))
                if (res.length !== 0) {
                    console.log(this.arrayData)
                    new UpdateSetStor(this.imei, this.port, this.arrayData, res[0].idObject)
                    this.setValidationImeiToBase(res[0].idObject)
                }

            }
        })
        this.socket.end();
    }

    async setValidationImeiToBase(id) { //валидация на наличие заведенного объекта с IMEI
        this.arrayData.map(e => {
            e['idObject'] = id
        })
        const table = 'wialon_ips'
        const base = new JobToBase()
        await base.createTable(table)

        for (let msg of this.arrayData) {
            await base.fillingTableColumns(msg, table)
            await base.fillingTableRows(msg, table)
        }
        console.log('Протокол wialon IPS -даные сохранены в БД')

    }

    reverseBinaryArray(stringOfInt) {
        return Number(stringOfInt)
            .toString(2)
            .split('')
            .reverse()
            .map((el) => parseInt(el));
    }
    createUnixTime(time) {
        const currentDate = new Date();
        // Извлечение часов, минут и секунд из временной строки
        const hours = parseInt(time.substring(0, 2));
        const minutes = parseInt(time.substring(2, 4));
        const seconds = parseInt(time.substring(4, 6));
        // Установка времени на текущую дату
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(seconds);
        // Добавление 3 часов к времени
        currentDate.setHours(currentDate.getHours() + 3);
        // Получение времени в формате Unix time
        const unixTime = Math.round(currentDate.getTime() / 1000);
        return unixTime
    }

    convertionLat(lat) {
        const deg = parseInt(lat.substring(0, 2))
        const minutes = parseFloat(lat.substring(2)) / 60
        const latOrigin = deg + minutes
        return latOrigin
    }
    convertionLon(lon) {
        const deg = parseInt(lon.substring(0, 3))
        const minutes = parseFloat(lon.substring(3)) / 60
        const lonOrigin = deg + minutes
        return lonOrigin

    }

    createObjectDataShort(data, allData) {
        const nowTime = Math.floor(new Date().getTime() / 1000)
        allData['time_reg'] = nowTime
        allData['imei'] = this.imei;
        allData['port'] = this.port
        allData['date'] = data[0];
        allData['time'] = this.createUnixTime(data[1])
        allData['lat'] = this.convertionLat(data[2]);
        allData['lon'] = this.convertionLon(data[4]);
        allData['speed'] = data[6];
        allData['course'] = data[7];
        allData['height'] = data[8];
        allData['sats'] = data[9];
    }

    createObjectDataLong(data, allData) {
        const nowTime = Math.floor(new Date().getTime() / 1000)
        allData['time_reg'] = nowTime
        allData['imei'] = this.imei;
        allData['port'] = this.port
        allData['date'] = data[0];
        allData['time'] = this.createUnixTime(data[1])
        allData['lat'] = this.convertionLat(data[2]);
        allData['lon'] = this.convertionLon(data[4]);
        allData['speed'] = data[6];
        allData['course'] = data[7];
        allData['height'] = data[8];
        allData['sats'] = data[9];
        allData['hdop'] = data[10];
        allData['inputs'] = this.reverseBinaryArray(data[11])[0]
        allData['outputs'] = this.reverseBinaryArray(data[12])[0]

        for (let i = 0; i < data[13].split(',').length; i++) {
            allData[`adc${i + 1}`] = data[13].split(',')[i] !== 'NA' ? parseFloat(data[13].split(',')[i]) : data[13].split(',')[i]
        }
        allData['ibutton'] = data[14]
        const splits = data[15].split(',');
        splits.forEach((el) => {
            const splitedParam = el.split(':');
            switch (splitedParam[1]) {
                case '1':
                    allData[splitedParam[0]] = parseInt(splitedParam[2]);
                    break;
                case '2':
                    allData[splitedParam[0]] = parseFloat(splitedParam[2]);
                    break;
                default:
                    allData[splitedParam[0]] = splitedParam[2];
                    break;
            }
        });
    }
}

module.exports = ListenPortIPS
