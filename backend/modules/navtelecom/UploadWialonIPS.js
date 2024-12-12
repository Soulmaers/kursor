const net = require('net');

class UploadWialonIPS {
    constructor(globalArrayMSG, imei) {
        this.globalArrayMSG = globalArrayMSG
        this.imei = imei
        this.noParamsArray = ['timeRagistration', 'lat', 'lon', 'speed', 'course', 'altitude', 'hdop', 'sats',
            'in1', 'in2', 'in3', 'in4', 'in5', 'in6', 'in7', 'in8', 'in9', 'in10', 'in11', 'in12', 'in13', 'in14', 'in15', 'in16',
            'out1', 'out2', 'out3', 'out4', 'out5', 'out6', 'out7', 'out8', 'out9', 'out10', 'out11', 'out12', 'out13', 'out14',
            'out15', 'out16', 'adc3', 'adc2', 'adc1', 'adc']
        this.type = {
            'number': 1,
            'double': 2,
            'string': 3
        }
        this.arrayIPS = []
        this.init()
    }

    init() {
        //    console.log(this.globalArrayMSG[0])
        this.addAuth()
        this.addParams()
        this.sendPacket()
    }

    addParams() {
        this.globalArrayMSG.forEach(e => {
            const params = { ...e };
            this.noParamsArray.forEach(key => {
                if (params.hasOwnProperty(key)) {
                    params[key] = null; // или другое значение по умолчанию
                }
            });
            const paramses = this.paramsConvert(params)
            const lat = this.convertionLat(e.lat)
            const lon = this.convertionLat(e.lon)
            let packageParams = `#D#`
            const date = this.formatTime(e.timeRagistration)
            const { inputs, outputs, adc } = this.InputsOutputsConvertion(e)
            packageParams += `${date.date};${date.time};`
            packageParams += `${lat};N;0${lon};E;`
            packageParams += `${parseInt(e.speed)};${e.course};${parseInt(e.altitude)};${e.sats};${e.hdop / 10};${inputs};${outputs};${adc};NA;${paramses}\r\n`
            this.arrayIPS.push(packageParams)
        })

    }
    addAuth() {
        this.authIPS = `b'#L#${String(this.imei)};NA\r\n'`
    }

    paramsConvert(params) {
        let str = ''
        for (const key in params) {
            if (params[key]) {
                let typeValue = this.type[typeof params[key]]
                if (typeValue === 1) {
                    const double = params[key].toString().includes('.');
                    if (double) typeValue = 2
                }
                str += `${key}:${typeValue}:${params[key]},`
            }
        }
        return str
    }


    InputsOutputsConvertion(e) {
        const adcKeys = Object.keys(e).filter(key => key.startsWith('adc'));
        const inKeys = Object.keys(e).filter(key => key.startsWith('in'));
        const outKeys = Object.keys(e).filter(key => key.startsWith('out'));
        const adc = (adcKeys.map(key => e[key])).join(',');
        const ins = (inKeys.map(key => e[key]).reverse()).join('');
        const outs = (outKeys.map(key => e[key]).reverse()).join('')
        return { inputs: ins, outputs: outs, adc: adc };
    }

    convertionLat(geo) {
        const d = Math.floor(geo);
        const minutesDecimal = ((geo - d) * 60).toFixed(4)
        const formatIPS = `${d}${minutesDecimal}`
        return formatIPS
    }
    formatTime(unix) {
        const date = new Date(unix * 1000); // Создаем объект Date из unix-времени
        const day = String(date.getDate()).padStart(2, '0'); // getDate() - день месяца
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() - месяц (0-11), поэтому +1
        const year = String(date.getFullYear()).slice(-2);
        const hour = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return {
            date: `${day}${month}${year}`,
            time: `${hour}${minutes}${seconds}`
        }
    }
    async sendPacket() {
        const client = new net.Socket();
        try {
            await this.connectionClient(client)
            client.write(this.authIPS);

            client.on('data', (data) => {
                console.log('wialon ips: ' + data);
                if (data.toString().trim() === '#AL#1') { this.handlerData(client) }
                if (data.toString().trim() === '#AD#1') client.destroy()
            })
            client.on('error', (err) => {
                console.error('Ошибка подключения: ' + err);
            });

            // Закрытие соединения
            client.on('close', () => {
                console.log('Соединение закрыто');
            });
        }
        catch (e) {
            console.log(e)
        }
    }
    handlerData(client) {
        // console.log(this.arrayIPS.join(','))
        client.write(this.arrayIPS.join(','));
    }
    connectionClient(client) {
        return new Promise((resolve, reject) => {
            client.connect(20332, '193.193.165.165', () => {
                resolve()
            })
            client.on('error', (err) => {
                reject(err)
            })

        })

    }
}

module.exports = UploadWialonIPS