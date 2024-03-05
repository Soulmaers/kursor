
const { NavtelecomResponceData, CheckSumm, BitsCount, WriteFile } = require('./Helpers');
const SendingCommandToTerminal = require('./SendingCommandToTerminal')
const helpers = require('../../helpers');
const { net } = require('../../../index')

class ListenPortTP {
    constructor(port) {
        this.port = port
        this.createServer(this.port)
    }

    createServer(port) {
        const tcpServer = net.createServer((socket) => {
            console.log('TCP Client connected');
            //  console.log(socket)
            new ChartServerTerminal(socket)
            new SendingCommandToTerminal(socket)
        });
        tcpServer.listen(port, () => {
            console.log(`TCP протокол слушаем порт ${port}`);
        });
    }
}


class ChartServerTerminal {
    constructor(socket) {
        this.socket = socket
        this.bits = [];
        this.responce = null;
        this.data = null;
        this.imei = null;
        this.protocolV = null;
        this.type = null
        this.port = this.socket.localPort
        this.globalArrayMSG = [];
        this.socketOn()
    }

    socketOn() {
        this.socket.on('data', async (data) => {
            this.data = data;
            const str = data.toString()
            if (str.startsWith('@')) {
                const preamble = data.slice(0, 4);
                const receiver = data.slice(4, 8);
                const sender = data.slice(8, 12);
                const bodyString = data.slice(16, data.length - 1).toString()
                if (bodyString.startsWith('*>S')) {
                    this.imei = Number((data.slice(20, data.length)).toString())
                    //   const valid=await validation()
                    console.log(this.imei)
                    const msg = '*<S'
                    this.handshake(preamble, receiver, sender, msg)
                }
                else if (bodyString.startsWith('*>FLEX')) {
                    const buffer = data.slice(23, 24).readUInt8()
                    switch (buffer) {
                        case 10:
                            this.protocolV = 'Flex 1.0'
                            break
                        case 20:
                            this.protocolV = 'Flex 2.0'
                            break
                        case 30:
                            this.protocolV = 'Flex 3.0'
                    }
                    this.protocol(preamble, receiver, sender)
                    const msg = '*?VGPS'// '*?ICCID'//*?V'
                    // const terminal = new SendingCommandToTerminal(this.socket)
                    // terminal.answer(preamble, receiver, sender, msg)
                }
            }
            else {
                let buf = this.data.slice(2)
                const type = this.data.slice(0, 2).toString();
                this.type = type

                if (type === '~A' || type === '~C') {
                    //  console.log(buf)
                    let count = type === '~A' ? buf.readUInt8() : 1
                    this.telemetrationFields(buf, type, count)
                    this.setData(this.imei, this.port)
                    WriteFile.writeDataFile(this.globalArrayMSG, this.imei)
                    this.globalArrayMSG = []
                    const response = Buffer.alloc(type === '~A' ? 3 : 2);
                    response.write(type, 'ascii');
                    type === '~A' ? response.writeUInt8(count, type.length, 1) : null
                    const crc8c = CheckSumm.crc8(response)
                    this.responce = Buffer.concat([response, Buffer.from([crc8c])])
                    this.responces(type === '~A' ? 'A~' : 'C~')
                }
                else if (type === '~T') {
                    const eventindex = buf.readUInt32LE()
                    buf = buf.slice(3)
                    this.telemetrationFields(buf, type, 1)
                    this.setData(this.imei, this.port)
                    WriteFile.writeDataFile(this.globalArrayMSG, this.imei)
                    this.globalArrayMSG = []
                    const response = Buffer.alloc(6);
                    response.write(type, 'ascii');
                    response.writeUInt32LE(eventindex, 2);
                    const crc8c = CheckSumm.crc8(response)
                    this.responce = Buffer.concat([response, Buffer.from([crc8c])])
                    this.responces('T~')
                }
            }
        });
    }

    async setData(imei, port) {
        await helpers.setDataToBase(imei, port, this.globalArrayMSG)
    }


    responces(msg) {
        const writeSuccessful = this.socket.write(this.responce);
        if (writeSuccessful) {
            console.log(`${msg}`);
        }
    }

    handshake(preamble, receiver, sender, msg) {
        const message = NavtelecomResponceData.assemblingMSG(msg)
        this.responce = NavtelecomResponceData.bufferAssembly(preamble, receiver, sender, message)
        this.responces('Данные успешно отправлены')
    }

    protocol(preamble, receiver, sender) {
        let buf = this.data.slice(25)
        let bitCount = buf.readUInt8();
        buf = buf.slice(1)
        let currentByte = 0;
        for (let i = 0; i < bitCount; i++) {
            if (i % 8 === 0) {
                currentByte = buf.readUInt8();
                buf = buf.slice(1)
            }
            BitsCount.check(currentByte, 7 - i % 8) ? this.bits.push(i + 1) : null
        }
        const mess = this.data.slice(22, 25)
        const payload = Buffer.from("*<FLEX", "ascii");
        const buffer = Buffer.concat([payload, mess])
        const crc = CheckSumm.xorSum(buffer)
        const lengthInBytes = Buffer.alloc(2);
        lengthInBytes.writeUInt16LE(buffer.length, 0)
        const message = { msg: buffer, crc: crc, lengthMsg: lengthInBytes }
        this.responce = NavtelecomResponceData.bufferAssembly(preamble, receiver, sender, message)
        this.responces('Данные протокола отправлены')
    }

    telemetrationFields(buf, type, count) {
        type === '~A' || type === '~T' ? buf = buf.slice(1) : null
        for (let u = 0; u < count; u++) {
            const global = {}
            const timeRagistration = Math.floor(new Date().getTime() / 1000)
            global.port = this.port
            global.imei = this.imei
            global.protocol = this.protocolV
            global.msg_type = this.type[1]
            global.timeRagistration = timeRagistration
            for (let j = 0; j < this.bits.length; j++) {
                let val;
                if (buf.length > 4) {
                    switch (this.bits[j]) {
                        case 1:
                            val = buf.readUInt32LE()
                            global.msg_number = val
                            buf = buf.slice(4)
                            break;
                        case 2:
                            val = buf.readUInt16LE()
                            global.event_code = val
                            buf = buf.slice(2)
                            break;
                        case 3:
                            val = buf.readUInt32LE()
                            global.time = val
                            buf = buf.slice(4)
                            break;
                        case 4:
                            val = buf.readUInt8()
                            global.status1 = BitsCount.check(val, 0) ? 'Тестовый режим' : 'Рабочий режим'
                            global.status2 = BitsCount.check(val, 1) ? 'Оповещение о тревоге(включено)' : 'Оповещение о тревоге(выключено)'
                            global.status3 = BitsCount.check(val, 2) ? 'Тревога(включена)' : 'Тревога(выключена)'
                            global.status6 = BitsCount.check(val, 5) ? 'Эвакуация(зафиксирована)' : 'Эвакуация(незафиксирована)'
                            global.status7 = BitsCount.check(val, 6) ? 'Режим Энергосбережения(нет)' : 'Режим Энергосбережения(да)'
                            global.status8 = BitsCount.check(val, 7) ? 'Калибровка акселерометра(не откалиброван)' : 'Калибровка акселерометра(откалиброван)'
                            const stat = ['Наблюдение', 'Охрана', 'До.охрана', 'Сервис']
                            global.status4 = stat[BitsCount.between(val, 3, 4)]
                            buf = buf.slice(1)
                            break;
                        case 5:
                            val = buf.readUInt8()
                            global.modules_st1 = BitsCount.check(val, 0) ? 'GSM включен' : 'GSM выключен'
                            global.modules_st2 = BitsCount.check(val, 1) ? 'USB включен' : 'USB выключен'
                            global.modules_st3 = BitsCount.check(val, 2) ? 'Дополнительный высокоточный навигационный приемник выключен'
                                : 'Дополнительный высокоточный навигационный приемник включен'
                            global.modules_st4 = BitsCount.check(val, 3) ? 'Часы не синхронизированы по GPS'
                                : 'Часы синхронизированы по GPS'
                            global.modules_st5 = BitsCount.check(val, 4) ? 'Работает вторая SIM-карта'
                                : 'Работает первая SIM-карта'
                            global.modules_st6 = BitsCount.check(val, 5) ? 'Регистрации в сотовой сети'
                                : 'Нет регистрации в сотовой сети'
                            global.modules_st7 = BitsCount.check(val, 6) ? 'Домашняя сотовая сеть'
                                : 'Роуминг'
                            global.modules_st8 = BitsCount.check(val, 7) ? 'Двигатель (генератор) включен'
                                : 'Двигатель (генератор) выключен'
                            buf = buf.slice(1)
                            break;
                        case 6:
                            val = buf.readUInt8()
                            if (BitsCount.between(val, 0, 1) === 0) {
                                global.modules_st21 = 'Нет глушения GSM'
                            }
                            if (BitsCount.between(val, 0, 1) === 1) {
                                global.modules_st21 = 'Обнаружено глушение GSM'
                            }
                            if (BitsCount.between(val, 0, 1) === 2) {
                                global.modules_st21 = 'Обнаружены промышленные помехи '
                            }
                            global.modules_st23 = BitsCount.check(val, 2) ? 'Обнаружено глушение GNSS' : 'Нет глушения GNSS'
                            global.modules_st24 = BitsCount.check(val, 3) ? 'Усреднение координат GNSS(да)' : 'Усреднение координат GNSS(нет)'
                            global.modules_st25 = BitsCount.check(val, 4) ? 'Статус акселерометра (ошибка)' : 'Статус акселерометра (штатная работа)'
                            global.modules_st26 = BitsCount.check(val, 5) ? 'Статус модуля Bluetooth(включен)' : 'Статус модуля Bluetooth(выключен)'
                            global.modules_st27 = BitsCount.check(val, 6) ? 'Статус модуля Wi-Fi(включен)' : 'Статус модуля Wi-Fi(выключен)'
                            global.modules_st28 = BitsCount.check(val, 7) ? 'Тип генератора для RTC:(внутренний генератор процессора)'
                                : 'Тип генератора для RTC:(внешний часовой кварцевый генератор)'

                            buf = buf.slice(1)
                            break;
                        case 7:
                            val = buf.readUInt8()
                            if (val === 0) {
                                global.gsm = '-113 Дб/м или меньше'
                            }
                            if (val === 1) {
                                global.gsm = '-111 Дб/м'
                            }
                            if (val >= 2 && val <= 30) {
                                global.gsm = '-109..-53 Дб/м'
                            }
                            if (val === 31) {
                                global.gsm = '-51 Дб/м или больше'
                            }
                            if (val === 99) {
                                global.gsm = 'Нет сигнала сотовой сети. '
                            }
                            buf = buf.slice(1)
                            break;
                        case 8:
                            val = buf.readUInt8()
                            global.nav_rcvr_state = BitsCount.check(val, 0) ? 'Навигационный приемник включен' : 'Навигационный приемник выключен'
                            global.valid_nav = BitsCount.check(val, 1) ? 'Валидная навигация' : 'Невалидная навигация'
                            global.sats = BitsCount.from(val, 2)
                            buf = buf.slice(1)
                            break;
                        case 9:
                            val = buf.readUInt32LE()
                            global.last_valid_time = val
                            buf = buf.slice(4)
                            break;
                        case 10:
                            val = buf.readInt32LE() * 0.0001 / 60;
                            global.lat = val
                            buf = buf.slice(4)
                            break;
                        case 11:
                            val = buf.readInt32LE() * 0.0001 / 60;
                            global.lon = val
                            buf = buf.slice(4)
                            break;
                        case 12:
                            val = buf.readInt32LE() * 0.1;
                            global.altitude = val
                            buf = buf.slice(4)
                            break;
                        case 13:
                            val = buf.readFloatLE()
                            global.speed = val
                            buf = buf.slice(4)
                            break;
                        case 14:
                            val = buf.readUInt16LE()
                            global.course = val
                            buf = buf.slice(2)
                            break;
                        case 15:
                            val = buf.readFloatLE()
                            global.meliage = val
                            buf = buf.slice(4)
                            break;
                        case 16:
                            val = buf.readFloatLE()
                            global.inter_mileage = val
                            buf = buf.slice(4)
                            break;
                        case 17:
                            val = buf.readUInt16LE()
                            global.positions_count = val
                            buf = buf.slice(2)
                            break;
                        case 18:
                            val = buf.readUInt16LE()
                            global.mileage_time = val
                            buf = buf.slice(2)
                            break;
                        case 19:
                            val = buf.readUInt16LE()
                            global.pwr_ext = val * 0.001
                            buf = buf.slice(2)
                            break;
                        case 20:
                            val = buf.readUInt16LE()
                            global.pwr_int = val
                            buf = buf.slice(2)
                            break;
                        case 21:
                        case 22:
                        case 23:
                        case 24:
                        case 25:
                        case 26:
                        case 27:
                        case 28:
                            val = buf.readUInt16LE()
                            global[`adc${this.bits[j] - 20}`] = val
                            buf = buf.slice(2)
                            break;
                        case 29:
                            val = buf.readUInt8()
                            global.in1 = BitsCount.check(val, 0) ? 1 : 0//'Вход IN1(датчик сработал)' : 'Вход IN1(датчик в нормальном состоянии)'
                            global.in2 = BitsCount.check(val, 1) ? 1 : 0//'Вход IN2(датчик сработал)' : 'Вход IN2(датчик в нормальном состоянии)'
                            global.in3 = BitsCount.check(val, 2) ? 1 : 0//'Вход IN3(датчик сработал)' : 'Вход IN3(датчик в нормальном состоянии)'
                            global.in4 = BitsCount.check(val, 3) ? 1 : 0//'Вход IN4/AIN1/AIN2(датчик сработал)' : 'Вход IN4/AIN1/AIN2(датчик в нормальном состоянии)'
                            global.in5 = BitsCount.check(val, 4) ? 1 : 0//'Вход IN5/AIN3(датчик сработал)' : 'Вход IN5/AIN3(датчик в нормальном состоянии)'
                            global.in6 = BitsCount.check(val, 5) ? 1 : 0//'Вход IN6/SH1(датчик сработал)' : 'Вход IN6/SH1(датчик в нормальном состоянии)'
                            global.in7 = BitsCount.check(val, 6) ? 1 : 0//'Вход IN7/SH2(датчик сработал)' : 'Вход IN7/SH2(датчик в нормальном состоянии)'
                            global.in8 = BitsCount.check(val, 7) ? 1 : 0//'Вход IN8/SH3-SH4(датчик сработал)' : 'Вход IN8/SH3-SH4(датчик в нормальном состоянии)'
                            buf = buf.slice(1)
                            break;
                        case 30:
                            val = buf.readUInt8()
                            global.in9 = BitsCount.check(val, 0) ? 1 : 0//'Вход IN9(датчик сработал)' : 'Вход IN9(датчик в нормальном состоянии)'
                            global.in10 = BitsCount.check(val, 1) ? 1 : 0//'Вход IN10(датчик сработал)' : 'Вход IN10(датчик в нормальном состоянии)'
                            global.in11 = BitsCount.check(val, 2) ? 1 : 0//'Вход IN11(датчик сработал)' : 'Вход IN11(датчик в нормальном состоянии)'
                            global.in12 = BitsCount.check(val, 3) ? 1 : 0//'Вход IN12(датчик сработал)' : 'Вход IN12(датчик в нормальном состоянии)'
                            global.in13 = BitsCount.check(val, 4) ? 1 : 0//'Вход IN13(датчик сработал)' : 'Вход IN13(датчик в нормальном состоянии)'
                            global.in14 = BitsCount.check(val, 5) ? 1 : 0//'Вход IN14(датчик сработал)' : 'Вход IN14(датчик в нормальном состоянии)'
                            global.in15 = BitsCount.check(val, 6) ? 1 : 0//'Вход IN15(датчик сработал)' : 'Вход IN15(датчик в нормальном состоянии)'
                            global.in16 = BitsCount.check(val, 7) ? 1 : 0//'Вход IN16(датчик сработал)' : 'Вход IN16(датчик в нормальном состоянии)'
                            buf = buf.slice(1)
                            break;
                        case 31:
                            val = buf.readUInt8()
                            global.out1 = BitsCount.check(val, 0) ? 1 : 0// 'Выход O1(включен)' : 'Выход O1(выключен)'
                            global.out2 = BitsCount.check(val, 1) ? 1 : 0//'Выход O2(включен)' : 'Выход O2(выключен)'
                            global.out3 = BitsCount.check(val, 2) ? 1 : 0//'Выход O3(включен)' : 'Выход O3(выключен)'
                            global.out4 = BitsCount.check(val, 3) ? 1 : 0//'Выход O4(включен)' : 'Выход O4(выключен)'
                            global.out5 = BitsCount.check(val, 4) ? 1 : 0//'Выход O5(включен)' : 'Выход O5(выключен)'
                            global.out6 = BitsCount.check(val, 5) ? 1 : 0//'Выход O6(включен)' : 'Выход O6(выключен)'
                            global.out7 = BitsCount.check(val, 6) ? 1 : 0// 'Выход O7(включен)' : 'Выход O7(выключен)'
                            global.out8 = BitsCount.check(val, 7) ? 1 : 0//'Выход O8(включен)' : 'Выход O8(выключен)'
                            buf = buf.slice(1)
                            break;
                        case 32:
                            val = buf.readUInt8()
                            global.out9 = BitsCount.check(val, 0) ? 1 : 0//'Выход O9(включен)' : 'Выход O9(выключен)'
                            global.out10 = BitsCount.check(val, 1) ? 1 : 0//'Выход 10(включен)' : 'Выход 10(выключен)'
                            global.out11 = BitsCount.check(val, 2) ? 1 : 0//'Выход 11(включен)' : 'Выход 11(выключен)'
                            global.out12 = BitsCount.check(val, 3) ? 1 : 0//'Выход 12(включен)' : 'Выход 12(выключен)'
                            global.out13 = BitsCount.check(val, 4) ? 1 : 0//'Выход 13(включен)' : 'Выход 13(выключен)'
                            global.out14 = BitsCount.check(val, 5) ? 1 : 0//'Выход 14(включен)' : 'Выход 14(выключен)'
                            global.out15 = BitsCount.check(val, 6) ? 1 : 0//'Выход 15(включен)' : 'Выход 15(выключен)'
                            global.out16 = BitsCount.check(val, 7) ? 1 : 0//'Выход 16(включен)' : 'Выход 16(выключен)'
                            buf = buf.slice(1)
                            break;
                        case 33:
                            val = buf.readUInt32LE()
                            global.imp_counter1 = val
                            buf = buf.slice(4)
                            break;
                        case 34:
                            val = buf.readUInt32LE()
                            global.imp_counter2 = val
                            buf = buf.slice(4)
                            break;
                        case 35:
                        case 36:
                            val = buf.readUInt16LE()
                            global[`freq${this.bits[j] - 34}`] = val
                            buf = buf.slice(2)
                            break;
                        case 37:
                            val = buf.readUInt32LE()
                            global.engine_hours = val
                            buf = buf.slice(4)
                            break;
                        case 38:
                        case 39:
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                            val = buf.readUInt16LE()
                            global[`rs485fuel_level${this.bits[j] - 37}`] = val
                            buf = buf.slice(2)
                            break;
                        case 44:
                            val = buf.readUInt16LE()
                            global.rs232fuel_level = val
                            buf = buf.slice(2)
                            break;
                        case 45:
                        case 46:
                        case 47:
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                            val = buf.readInt8()
                            global[`temp${this.bits[j] - 44}`] = val !== 0x80 ? val : '-128'
                            buf = buf.slice(1)
                            break;
                        case 53:
                            console.log('53', buf.length)
                            val = buf.readUInt16LE()
                            if (val != 0x7FFF) {
                                if (BitsCount.check(val, 15)) {
                                    global.can_fuel_lvl = BitsCount.to(val, 14)
                                } else {
                                    global.can_fuel_vlm = BitsCount.to(val, 14) * 0.1;
                                }
                            }
                            buf = buf.slice(2)
                            console.log('53', buf.length)
                            break;
                        case 54:
                            val = buf.readFloatLE() * 0.5
                            global.can_fuel_consumpt = val >= 0 ? val : null
                            buf = buf.slice(4)
                            break;
                        case 55:
                            val = buf.readUInt16LE()
                            global.engine_rpm = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 56:
                            val = buf.readInt8()
                            global.engine_coolant_temp = val !== 0x80 ? val : null
                            buf = buf.slice(1)
                            break;
                        case 57:
                            val = buf.readFloatLE()
                            global.can_mileage = val >= 0 ? val : null
                            buf = buf.slice(4)
                            break;
                        case 58:
                        case 59:
                        case 60:
                        case 61:
                        case 62:
                            val = buf.readUInt16LE()
                            global[`can_axis_weight${this.bits[j] - 57}`] = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 63:
                            val = buf.readUInt8()
                            global.accel_pedal_pos = val !== 0xFF ? val : null
                            buf = buf.slice(1)
                            break;
                        case 64:
                            val = buf.readUInt8()
                            global.brake_pedal_pos = val !== 0xFF ? val : null
                            buf = buf.slice(1)
                            break;
                        case 65:
                            val = buf.readUInt8()
                            global.engine_load = val !== 0xFF ? val : null
                            buf = buf.slice(1)
                            break;
                        case 66:
                            val = buf.readUInt16LE()
                            if (val != 0x7FFF) {
                                if (BitsCount.check(val, 15)) {
                                    global.can_dfl_level = BitsCount.to(val, 14);
                                } else {
                                    global.can_dfl_volume = BitsCount.to(val, 14) * 0.1;
                                }
                            }
                            buf = buf.slice(2)
                            break;
                        case 67:
                            val = buf.readUInt32LE()
                            global.can_engine_hours = val
                            buf = buf.slice(4)
                            break;
                        case 68:
                            val = buf.readInt16LE()
                            global.can_dtm = val != 0xFFFF ? val * 5000 : null;
                            buf = buf.slice(2)
                            break;
                        case 69:
                            val = buf.readUInt8()
                            global.can_speed = val != 0xFF ? val : null
                            buf = buf.slice(1)
                            break;
                        case 70:  ////flex 2.0
                            val = buf.readUInt8()
                            global.sats_gl = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_gps = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_gal = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_comp = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_beid = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_dor = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_irnss = val
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.sats_qzss = val
                            buf = buf.slice(1)
                            break;
                        case 71:
                            val = buf.readUInt8()
                            global.hdop = val * 10
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            global.pdop = val * 10
                            buf = buf.slice(1)
                            break;
                        case 72:
                            val = buf.readUInt8()
                            global.prec_info = BitsCount.check(val, 0) ? 'fixed' : 'float'//Навигационная информация в fixed point' : 'Навигационная информация в float point'
                            global.prec_info = BitsCount.check(val, 1) ? 1 : 0//'Приёмник работает в режиме RTK (навигация достоверна)' : 'Приёмник не работает в режиме RTK'
                            global.prec_sats = BitsCount.from(val, 2)
                            buf = buf.slice(1)
                            break;
                        case 73:
                            val = buf.readInt64LE()
                            global.lat_angle = val
                            buf = buf.slice(8)
                            val = buf.readInt64LE()
                            global.lon_angle = val
                            buf = buf.slice(8)
                            break;
                        case 74:
                            val = buf.readInt32LE()
                            global.sea_level = val
                            buf = buf.slice(4)
                            break;
                        case 75:
                            val = buf.readUInt16LE()
                            global.course_flex2 = val
                            buf = buf.slice(2)
                            break;
                        case 76:
                            val = buf.readFloatLE()
                            global.speed_flex2 = val
                            buf = buf.slice(4)
                            break;
                        case 77:
                            val = buf.readUInt32LE()
                            global.cell_id = val
                            buf = buf.slice(4)
                            val = buf.readUInt16LE()
                            global.lac = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.mcc = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.mnc = val
                            buf = buf.slice(2)
                            val = buf.readUInt8()
                            global.rx_level = val
                            buf = buf.slice(1)
                            val = buf.readUInt32LE()
                            global.cell_id1 = val
                            buf = buf.slice(4)
                            val = buf.readUInt16LE()
                            global.lac1 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.mcc1 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.mnc1 = val
                            buf = buf.slice(2)
                            val = buf.readUInt8()
                            global.rx_level1 = val
                            buf = buf.slice(1)
                            val = buf.readUInt32LE()
                            global.cell_id2 = val
                            buf = buf.slice(4)
                            val = buf.readUInt16LE()
                            global.lac2 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.mcc2 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.mnc2 = val
                            buf = buf.slice(2)
                            val = buf.readUInt8()
                            global.rx_level2 = val
                            buf = buf.slice(1)
                            val = buf.readUInt32LE()
                            global.lbs_time = val
                            buf = buf.slice(4)
                            break;
                        case 78:
                        case 79:
                        case 80:
                        case 81:
                        case 82:
                        case 83:
                            val = buf.readInt8()
                            global[`rs485fuel_temp${this.bits[j] - 77}`] = val
                            buf = buf.slice(1)
                            break;
                        case 84:
                        case 85:
                        case 86:
                        case 87:
                        case 88:
                        case 89:
                        case 90:
                        case 91:
                        case 92:
                        case 93:
                            val = buf.readUInt16LE()
                            global[`rs485fuel_level${this.bits[j] - 83}`] = val
                            buf = buf.slice(2)
                            val = buf.readInt8()
                            global[`rs485fuel_temp${this.bits[j] - 83}`] = val
                            buf = buf.slice(1)
                            break;
                        case 94:
                            buf = funct(buf, 1)
                            buf = funct(buf, 2)
                            break;
                        case 95:
                            for (let i = 3; i <= 6; i++) {
                                buf = funct(buf, i)
                            }
                            break;
                        case 96:
                            for (let i = 7; i <= 14; i++) {
                                buf = funct(buf, i)
                            }
                            break;
                        case 97:
                            for (let i = 15; i <= 30; i++) {
                                buf = funct(buf, i)
                            }
                            break;
                        case 98:
                            val = buf.readUInt8()
                            const driver1 = ['Отдых', 'Готовность к работе', 'Работа не связанна управлением ТС', ' Управление ТС'];
                            global.tacho_active_driver1 = driver1[BitsCount.between(val, 0, 1)];
                            const slot1 = ['Нет карты', 'Не авторизована', 'Авторизована', ' Не удалось извлечь'];
                            global.tacho_slot1 = slot1[BitsCount.between(val, 2, 3)];
                            const driver2 = ['Отдых', 'Готовность к работе', 'Работа не связанна управлением ТС', ' Управление ТС'];
                            global.tacho_active_driver2 = driver2[BitsCount.between(val, 4, 5)];
                            const slot2 = ['Нет карты', 'Не авторизована', 'Авторизована', ' Не удалось извлечь'];
                            global.tacho_slot2 = slot2[BitsCount.between(val, 6, 7)];
                            buf = buf.slice(1)
                            break;
                        case 99:
                            val = buf.readUInt8()
                            const taho = ['Тахограф отключен', 'Водитель', 'Мастер', 'Контролер', 'Предприятие', 'Экипаж'];
                            global.tacho_mode = taho[val]
                            buf = buf.slice(1)
                            break;
                        case 100:
                            val = buf.readUInt16LE()
                            global.tacho_state1 = BitsCount.check(val, 0) ? 1 : 0  //'Зажигание:(включено)' : 'Зажигание:(выключено)'
                            global.tacho_state2 = BitsCount.check(val, 1) ? 1 : 0  //'Масса отключена:(да)' : 'Масса отключена:(нет)'
                            global.tacho_state3 = BitsCount.check(val, 2) ? 1 : 0  //'Режим «Паром/Поезд»:(включен)' : 'Режим «Паром/Поезд»:(выключен)'
                            global.tacho_state4 = BitsCount.check(val, 3) ? 1 : 0  //'Режим «Неприменимо»:(включен)' : 'Режим «Неприменимо»:(выключен)'
                            global.tacho_state5 = BitsCount.check(val, 4) ? 1 : 0  //'Подсветка:(включена)' : 'Подсветка:(выключена)'
                            global.tacho_state6 = BitsCount.check(val, 5) ? 1 : 0 /// 'Ошибка связи с тахографом:(да)' : 'Ошибка связи с тахографом:(нет)'
                            const tachoArray = ['Не обнаружено предупреждений по временным нормативам', 'Ограничение #1: 15 мин перед наступлением 4,5 ч. непрерывного вождения',
                                'Ограничение #2: превышение 4,5 ч. непрерывного вождения', ' Ограничение #3: 15 мин до дополнительного Предупреждения 1 ',
                                'Ограничение #4: произошло Предупреждение 1', 'ограничение #5: 15 мин до дополнительного Предупреждения 2',
                                'Ограничение #6: произошло Предупреждение 2', ' Резерв'];
                            global.tacho_state7 = tachoArray[BitsCount.between(val, 6, 8)];
                            global.tacho_state10 = tachoArray[BitsCount.between(val, 9, 11)];
                            global.tacho_state = BitsCount.check(val, 12) || BitsCount.check(val, 13) || BitsCount.check(val, 14) || BitsCount.check(val, 15) ? 'Резерв' : null
                            buf = buf.slice(2)
                            break;
                        case 101:
                            val = buf.readUInt8()
                            global.tacho_speed = val !== 255 ? val : null
                            buf = buf.slice(1)
                            break;
                        case 102:
                            val = buf.readUInt32LE()
                            global.tacho_odom = val !== 0xFFFFFFFF ? val : null
                            buf = buf.slice(4)
                            break;
                        case 103:
                            val = buf.readUInt32LE()
                            global.tacho_time = val
                            buf = buf.slice(4)
                            break;
                        case 104:
                            val = buf.readUInt8()
                            const condition = [null, 'На вызове', 'На рейсе', 'Свободен', 'Ожидание', "Возвращение", 'Резерв', 'В работе',
                                'Перерыв', 'Готовность', 'Обед', 'Отдых', 'Ремонт', 'Загрузка', 'Разгрузка', 'Поломка', 'ДТП']
                            global.dm_status = condition[val]
                            buf = buf.slice(1)
                            break;
                        case 105:
                            val = buf.readUInt32LE()
                            global.dm_mess_n = val === 0 ? 'Нет полученных сообщений' : val === 0xFFFFFFFF ? 'Получено/прочитано сообщение, переданное командой NTCT' : val
                            buf = buf.slice(4)
                            break;
                        case 106:
                            val = buf.readUInt16LE()
                            global.time_shift = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 107:
                            val = buf.readInt16LE()
                            global.acc_x = val * 1000
                            buf = buf.slice(2)
                            val = buf.readInt16LE()
                            global.acc_y = val * 1000
                            buf = buf.slice(2)
                            val = buf.readInt16LE()
                            global.acc_z = val * 1000
                            buf = buf.slice(2)
                            break;
                        case 108:
                            val = buf.readUInt16LE()
                            global.thld_duration = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 109:
                            val = buf.readInt16LE()
                            global.wln_accel_max = val * 1000
                            buf = buf.slice(2)
                            val = buf.readInt16LE()
                            global.wln_brk_max = val * 1000
                            buf = buf.slice(2)
                            val = buf.readInt16LE()
                            global.wln_crn_max = val * 1000
                            buf = buf.slice(2)
                            break;
                        case 110:
                            buf = funct2(buf, 1)
                            buf = funct2(buf, 2)
                            break;
                        case 111:
                            buf = funct2(buf, 3)
                            buf = funct2(buf, 4)
                            break;
                        case 112:
                            buf = funct2(buf, 5)
                            buf = funct2(buf, 6)
                            break;
                        case 113:
                            buf = funct2(buf, 7)
                            buf = funct2(buf, 8)
                            break;
                        case 114:
                            buf = funct2(buf, 9)
                            buf = funct2(buf, 10)
                            break;
                        case 115:
                            buf = funct2(buf, 11)
                            buf = funct2(buf, 12)
                            break;
                        case 116:
                            buf = funct2(buf, 13)
                            buf = funct2(buf, 14)
                            break;
                        case 117:
                            buf = funct2(buf, 15)
                            buf = funct2(buf, 16)
                            break;
                        case 118:
                            val = buf.readUInt8()
                            global.autoinf_status1 = BitsCount.check(val, 0) ? 1 : 0 //'Автоинформатор включен' : 'Автоинформатор выключен'
                            global.autoinf_status2 = BitsCount.check(val, 1) ? 1 : 0 //'Объект в геозоне' : 'Объект вне геозоны'
                            global.autoinf_status3 = BitsCount.check(val, 2) ? 1 : 0 //'Геозона соотвествует маршруту ' : 'Геозона не соотвествует маршруту '
                            global.autoinf_status4 = BitsCount.check(val, 3) ? 1 : 0 //'Ошибка на маршруте' : 'Нет ошибок'
                            global.autoinf_status5 = BitsCount.check(val, 4) ? 1 : 0 //'Ошибка при работе с SD-картой' : 'Нет ошибок'
                            global.autoinf_status6 = BitsCount.check(val, 5) ? 1 : 0 //'Нарушение режима движения' : 'Нет нарушения'
                            global.autoinf_status7 = BitsCount.check(val, 6) ? 1 : 0 //'Ручной режим' : 'Автоматический режим'
                            global.autoinf_status = BitsCount.check(val, 7) ? 'Резерв' : null
                            buf = buf.slice(1)
                            break;
                        case 119:
                            val = buf.readInt16LE()
                            global.last_geo_id = val !== 0 ? val : 0
                            buf = buf.slice(2)
                            break;
                        case 120:
                            val = buf.readInt16LE()
                            global.last_stop_id = val !== 0 ? val : 0
                            buf = buf.slice(2)
                            break;
                        case 121:
                            val = buf.readInt16LE()
                            global.cur_route_id = val !== 0 ? val : 0
                            buf = buf.slice(2)
                            break;
                        case 122:
                            val = buf.readUInt8()
                            global.camera_status1 = BitsCount.check(val, 0) ? 1 : 0 //'Камера доступна' : 'Камера не доступна'
                            global.camera_status2 = BitsCount.check(val, 1) ? 1 : 0 //'Автоматическая съёмка включена' : 'Автоматическая съёмка выключена'
                            global.camera_status3 = BitsCount.check(val, 2) ? 1 : 0 //'Кол-во хранимых снимков превысило максимум' : 'Штатный режим работы'
                            global.camera_status4 = BitsCount.check(val, 3) ? 1 : 0 //'Ошибка при работе с SD-картой' : 'Нет ошибок'
                            for (let i = 4; i <= 7; i++) {
                                global.camera_status = BitsCount.check(val, i) ? 'Резерв' : null;
                            }
                            buf = buf.slice(1)
                            break;
                        case 123: //flex 3.0
                            val = buf.readUInt8()
                            global.status21 = BitsCount.check(val, 0) ? 1 : 0 //'корпус вскрыт' : 'в норме';
                            const st12 = ['Контроль не производится', 'Перегрузка', 'Не подключена', 'Норма']
                            global.status22 = st12[BitsCount.between(val, 1, 2)]
                            const st35 = ['Нет программы', 'Ошибка', 'Остановлена', 'резерв', 'На паузе', 'Исполняется', 'Резерв', 'Резерв']
                            global.status23 = st35[BitsCount.between(val, 3, 5)]
                            //  for (i = 6; i <= 7; i++) {
                            // global.status20 = BitsCount.check(val, i) ? 'Резерв' : null;
                            //  }
                            buf = buf.slice(1)
                            break;
                        case 124:
                            val = buf.readUInt8()
                            global.modules_st31 = BitsCount.check(val, 0) ? 1 : 0 //'Включен' : 'Выключен';
                            global.modules_st32 = BitsCount.check(val, 1) ? 1 : 0 //'Включен' : 'Выключен';
                            global.modules_st33 = BitsCount.check(val, 2) ? 1 : 0 //'Используется дополнительный' : 'Используется основной';
                            // for (i = 3; i <= 7; i++) {
                            // global.modules_st30 = BitsCount.check(val, i) ? 'Резерв' : null;
                            //   }
                            buf = buf.slice(1)
                            break;
                        case 125:
                            val = buf.readUInt8()
                            const st = ['Отсутствует', '2G', '3G', '4G', 'резерв', 'резерв', 'резерв', 'резерв']
                            global.connection_st1 = st[BitsCount.between(val, 0, 2)]
                            for (let i = 4; i <= 8; i++) {
                                global[`connection_st${i}`] = BitsCount.check(val, i - 1) ? 1 : 0 //'Подключен' : 'Не подключен';
                            }
                            buf = buf.slice(1)
                            break;
                        case 126:
                            val = buf.readUInt8()
                            for (let i = 0; i <= 7; i++) {
                                global[`in${i + 17}`] = BitsCount.check(val, i) ? 1 : 0 // 'Датчик сработал' : 'Датчик в нормальном состоянии';
                            }
                            buf = buf.slice(1)
                            break;
                        case 127:
                        case 128:
                        case 129:
                        case 130:
                        case 131:
                        case 132:
                            val = buf.readUInt32LE()
                            global[`imp_counter${this.bits[j] - 124}`] = val
                            buf = buf.slice(4)
                            break;
                        case 133:
                        case 134:
                        case 135:
                        case 136:
                        case 137:
                        case 138:
                            val = buf.readUInt16LE()
                            global[`freq${this.bits[j] - 130}`] = val
                            buf = buf.slice(2)
                            break;
                        case 139:
                            val = buf.readUInt8()
                            for (let i = 1; i <= 5; i++) {
                                global[`accel_st${i}`] = BitsCount.check(val, i - 1) ? 1 : 0 //'Датчик сработал' : 'Датчик в нормальном состоянии';
                            }
                            //  for (i = 6; i <= 7; i++) {
                            // global.accel_st = BitsCount.check(val, i) ? 'Резерв' : null;
                            //  }
                            buf = buf.slice(1)
                            break;
                        case 140:
                            val = buf.readUInt8()
                            global.int_tilt_sens_local = val * 0.25
                            buf = buf.slice(1)
                            break;
                        case 141:
                            val = buf.readInt8()
                            global.int_tilt_sens_pitch = val
                            buf = buf.slice(1)
                            val = buf.readInt8()
                            global.int_tilt_sens_roll = val * 1.5
                            buf = buf.slice(1)
                            break;
                        case 142:
                            val = buf.readInt8()
                            global.ext_tilt_sens_x = val
                            buf = buf.slice(1)
                            val = buf.readInt8()
                            global.ext_tilt_sens_y = val
                            buf = buf.slice(1)
                            val = buf.readInt8()
                            global.ext_tilt_sens_z = val
                            buf = buf.slice(1)
                            break;
                        case 143:
                            val = buf.readInt16LE()
                            global.wln_vert_max = val * 1000
                            buf = buf.slice(2)
                            break;
                        case 144:
                            val = buf.readUInt8()
                            global.wln_spd_max = val
                            buf = buf.slice(1)
                            break;
                        case 145:
                            val = buf.readUInt8()
                            for (let i = 1; i <= 5; i++) {
                                global[`thld_spd_st${i}`] = BitsCount.check(val, i - 1) ? 1 : 0 //'Датчик сработал' : 'Датчик в нормальном состоянии';
                            }
                            //  for (i = 6; i <= 7; i++) {
                            //global.thld_spd_st = BitsCount.check(val, i) ? 'Резерв' : null;
                            // }
                            buf = buf.slice(1)
                            break;
                        case 146:
                            val = buf.readUInt8()
                            for (let i = 0; i <= 7; i++) {
                                i < 4 ? global[`thld_accel_st${i + 1}`] : global[`thld_brk_st${i + 1}`] = BitsCount.check(val, 0) ? 1 : 0 //'Датчик сработал' : 'Датчик в нормальном состоянии'
                            }
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            for (let i = 0; i <= 7; i++) {
                                i < 4 ? global[`thld_left_crn_st${i + 1}`] : global[`thld_right_crn_st${i + 1}`] = BitsCount.check(val, 0) ? 1 : 0 //'Датчик сработал' : 'Датчик в нормальном состоянии'
                            }
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            for (let i = 0; i <= 7; i++) {
                                i < 4 ? global[`thld_vert_st${i + 1}`] = BitsCount.check(val, 0) ? 1 : 0 /* 'Датчик сработал' : 'Датчик в нормальном состоянии'*/ :
                                    null // global.thld_vert_st = BitsCount.check(val, 0) ? 'Резерв' :
                            }
                            buf = buf.slice(1)
                            break;
                        case 147:
                        case 148:
                        case 149:
                        case 150:
                        case 151:
                        case 152:
                        case 153:
                        case 154:
                        case 155:
                        case 156:
                        case 157:
                        case 158:
                        case 159:
                        case 160:
                        case 161:
                        case 162:
                            val = buf.readUInt16LE()
                            global[`rs485fuel_freq${this.bits[j] - 146}`] = val
                            buf = buf.slice(2)
                            break;
                        case 163:
                        case 164:
                        case 165:
                        case 166:
                            val = buf.readInt16LE()
                            global[`hp_temp${this.bits[j] - 162}`] = val !== 0x8000 ? val * 0.05 : null
                            buf = buf.slice(2)
                            break;
                        case 167:
                        case 168:
                        case 169:
                        case 170:
                            val = buf.readUInt8()
                            global[`hp_humidity${this.bits[j] - 162}`] = val !== 0xFF ? val * 0.5 : 'Нет данных'
                            buf = buf.slice(1)
                            break;
                        case 171:
                            val = buf.readUInt16LE()
                            const msg = ['холостой ход', 'номинальный режим', 'перегрузка', 'накрутка', 'отрицательный', 'вмешательство',
                                'резерв', 'резерв', 'резерв', 'резерв', 'резерв', 'резерв', 'резерв', 'резерв', 'резерв', 'резерв']
                            global.flowsens_feed_mode = msg[BitsCount.between(val, 0, 3)]
                            global.flowsens_return_mode = msg[BitsCount.between(val, 4, 7)]
                            global.flowsens_cons_mode = msg[BitsCount.between(val, 8, 11)]
                            global.flowsens_pwr_mode = msg[BitsCount.between(val, 12, 13)]
                            //   for (i = 14; i <= 15; i++) {
                            //global.flowsens_st = BitsCount.check(val, i) ? 'Резерв' : null;
                            //  }
                            buf = buf.slice(2)
                            break;
                        case 172:
                            val = buf.readUInt32LE()
                            global.flowsens_fault = 'Резерв'
                            buf = buf.slice(4)
                            break;
                        case 173:
                            val = buf.readUInt32LE()
                            global.flowsens_total_cons = val !== 0xFFFFFFFF ? val : null
                            buf = buf.slice(4)
                            break;
                        case 174:
                            val = buf.readUInt32LE()
                            global.flowsens_trip_cons = val !== 0xFFFFFFFF ? val : null
                            buf = buf.slice(4)
                            break;
                        case 175:
                            val = buf.readInt16LE()
                            global.flowsens_flow_spd = val !== 0x8000 ? val : null
                            buf = buf.slice(2)
                            break;
                        case 176:
                            val = buf.readUInt32LE()
                            global.flowsens_feed_cons = val !== 0xFFFFFFFF ? val : null
                            buf = buf.slice(4)
                            break;
                        case 177:
                            val = buf.readInt16LE()
                            global.flowsens_feed_flow_spd = val !== 0x8000 ? val : null
                            buf = buf.slice(2)
                            break;
                        case 178:
                            val = buf.readInt16LE()
                            global.flowsens_feed_temp = val !== 0x8000 ? val : null
                            buf = buf.slice(2)
                            break;
                        case 179:
                            val = buf.readUInt32LE()
                            global.flowsens_return_cons = val !== 0xFFFFFFFF ? val : null
                            buf = buf.slice(4)
                            break;
                        case 180:
                            val = buf.readInt16LE()
                            global.flowsens_return_flow_spd = val !== 0x8000 ? val : null
                            buf = buf.slice(2)
                            break;
                        case 181:
                            val = buf.readInt16LE()
                            global.flowsens_return_temp = val !== 0x8000 ? val : null
                            buf = buf.slice(2)
                            break;
                        case 182:
                            val = buf.readUInt8()
                            global.fridge_connect = BitsCount.check(val, 0) ? 1 : 0 //'На связи' : 'Отсутствует'
                            global.fridge_door = BitsCount.check(val, 1) ? 1 : 0 //'Открыта' : 'Закрыта'
                            const msgs = ['неизвестная', 'ThermoKing серии SLX', 'Carrier Standard32', 'Zanotti', 'ThermalMaster', 'Carrier NDP33LN6FB']
                            global.fridge_type = msgs[BitsCount.between(val, 2, 4)]
                            buf = buf.slice(1)
                            val = buf.readUInt8()
                            const msgs2 = ['нет данных', 'Двигатель выключен', 'Нагрев', 'Охлаждение', 'Оттайка']
                            global.fridge_mode = msgs2[val] <= 4 ? msgs2[val] : val
                            buf = buf.slice(1)
                            break;
                        case 183:
                        case 184:
                        case 185:
                            val = buf.readInt16LE()
                            global[`fridge_temp${this.bits[j] - 182}`] = val !== 0x8000 ? val * 0.01 : null
                            buf = buf.slice(2)
                            break;
                        case 186:
                        case 187:
                        case 188:
                            val = buf.readInt16LE()
                            global[`fridge_set_temp${this.bits[j] - 185}`] = val !== 0x8000 ? val * 0.01 : null
                            buf = buf.slice(2)
                            break;
                        case 189:
                            val = buf.readInt16LE()
                            global.fridge_outside_temp = val !== 0x8000 ? val * 0.01 : null
                            buf = buf.slice(2)
                            break;
                        case 190:
                            val = buf.readInt16LE()
                            global.fridge_coolant_temp = val !== 0x8000 ? val * 0.01 : null
                            buf = buf.slice(2)
                            break;
                        case 191:
                            val = buf.readUInt16LE()
                            global.fridge_pwr_vlt = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 192:
                            val = buf.readUInt16LE()
                            global.fridge_pwr_cur = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 193:
                            val = buf.readUInt32LE()
                            global.fridge_eng_moto_hours = val !== 0xFFFF ? val * 0.01 : null
                            buf = buf.slice(4)
                            break;
                        case 194:
                            val = buf.readUInt32LE()
                            global.fridge_elec_moto_hours = val !== 0xFFFF ? val * 0.01 : null
                            buf = buf.slice(4)
                            break;
                        case 195:
                            val = buf.readUInt16LE()
                            global.fridge_fault_count = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.fridge_fault1 = val
                            buf = buf.slice(2)
                            break;
                        case 196:
                            val = buf.readUInt16LE()
                            global.fridge_fault2 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.fridge_fault3 = val
                            buf = buf.slice(2)
                            break;
                        case 197:
                            val = buf.readUInt16LE()
                            global.fridge_fault4 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.fridge_fault5 = val
                            buf = buf.slice(2)
                            val = buf.readUInt16LE()
                            global.fridge_fault6 = val
                            buf = buf.slice(2)
                            break;
                        case 198:
                            val = buf.readUInt8()
                            const msgfridge = ['нет данных', 'оборотов нет, двигатель остановлен', 'работает дизель, малые обороты', 'работает дизель, высокие обороты;', 'Работает от сети']
                            global.fridge_engine_mode = msgfridge[val]
                            buf = buf.slice(1)
                            val = buf.readUInt16LE()
                            global.fridge_engine_rpm = val !== 0xFFFF ? val : null
                            buf = buf.slice(2)
                            break;
                        case 199:
                            val = buf.readUInt8()
                            const msgComp = ['нет данных', 'Start/Stop - режим с остановкой двигателя', 'Continuous - режим постоянной работы']
                            global.fridge_comp_mode = msgComp[val] <= 2 ? msgComp[val] : val
                            buf = buf.slice(1)
                            break;
                        case 200:
                            val = buf.readUInt16LE()
                            for (let i = 0; i < 10; i++) {
                                global[`geo_st${i + 1}`] = BitsCount.check(val, i) ? 1 : 0//'В геозоне' : 'Вне геозоны'
                            }

                            buf = buf.slice(2)
                            break;
                        case 201:
                            val = buf.readUInt16LE()
                            const arr = ['Зажигание включено', 'Штатная сигнализация поставлена на охрану (находится в режиме тревоги)', 'Автомобиль закрыт при помощи штатного брелока'
                                , 'Ключ находится в замке зажигания', 'Включено динамичное зажигание 2', 'Открыта передняя пассажирская дверь', 'Открыты задние пассажирские двери',
                                'Сцепление выжато', 'Открыта дверь водителя', 'Открыты двери пассажира', 'Открыт багажник', 'Открыт капот', 'Затянут рычаг ручного тормоза',
                                'Нажат ножной тормоз', 'Двигатель работает', 'Webasto']
                            for (let i = 0; i < 16; i++) {
                                global[`can_info_st${i + 1}`] = BitsCount.check(val, i) ? arr[i] : null
                            }
                            buf = buf.slice(2)
                            break;
                        case 202:
                            val = buf.readUInt8()
                            const arr1 = ['Нет события', 'Автомобиль закрыт при помощи штатного брелока', ' Автомобиль открыт при помощи штатного брелока',
                                'Багажник открыт при помощи штатного брелока', 'Модуль выслал сигнал перепостановки в сигнализацию', 'Зарезервировано', 'Зарезервировано',
                                'модуль перешел в режим экономии энергии «sleep mode»']
                            global.can_security_evt = val < 8 ? arr1[val] : 'Зарезервировано'
                            buf = buf.slice(1)
                            break;
                        case 203:
                            val = buf.readUInt32LE()
                            const arr203 = ['STOP', 'Давление / уровень масла', 'Температура / уровень хладагента', 'Система ручного тормоза', 'Зарядка батареи',
                                'AIRBAG (подушка безопасности)', 'ESP выключена', 'EPS включен (электро усилитель руля)', 'Проверьте двигатель', 'Неисправность освещения',
                                'Низкое давление воздуха в шине', 'Изношенные тормозные колодки', 'Предупреждение', 'ABS (антиблокировочная система)', 'Низкий уровень топлива',
                                'Приближающееся сервисное обслуживание', 'ESP (электронный регулятор устойчивости)', 'Индикатор запальной свечи', 'FAP (фильтр макрочастиц)',
                                'EPC (электрическая регулировка давления)', 'Габаритные огни', 'Ближний свет фар', 'Дальний свет фар', 'Аварийная сигнализация', 'Готовность начать движение',
                                'Круиз-контроль', 'Ретардер автоматический', 'Ретардер ручной', 'Кондиционер включен', 'Коробка отбора мощности (PTO)', 'Ремень водителя', 'Ремень пассажира']
                            for (let i = 0; i < 32; i++) {
                                global[`can_alarm_st${i + 1}`] = BitsCount.check(val, i) ? arr203[i] : null
                            }
                            buf = buf.slice(4)
                            break;
                        case 204:
                            val = buf.readUInt8()
                            const arr204 = ['Горит лампа индикации неисправности', 'Горит красная лампа «Stop»', 'Горит желтая лампа «Предупреждение»', 'Горит лампа «Защита»',
                                'Мигает лампа неисправности', 'Мигает красная лампа «Stop»', 'Мигает желтая лампа «Предупреждение»', 'Мигает лампа «Защита»']
                            for (let i = 0; i < 8; i++) {
                                global[`can_fault_st${i + 1}`] = BitsCount.check(val, i) ? arr204[i] : null
                            }
                            buf = buf.slice(1)
                            val = buf.readUInt32LE()
                            global.can_fault = val
                            buf = buf.slice(4)
                            break;
                        case 205:
                            val = buf.readUInt32LE()
                            global.engine_hours_work = val
                            buf = buf.slice(4)
                            break;
                        case 206:
                            val = buf.readUInt32LE()
                            global.diag = val
                            buf = buf.slice(4)
                            break;
                        default:
                            if ((207 <= this.bits[j]) && (this.bits[j] <= 222)) {
                                val = buf.readInt8()
                                global[`user_1u_${this.bits[j] - 206}`] = val
                                buf = buf.slice(1)
                            }
                            else if ((223 <= this.bits[j]) && (this.bits[j] <= 237)) {
                                val = buf.readUInt16LE()
                                global[`user_2u_${this.bits[j] - 222}`] = val
                                buf = buf.slice(2)
                            }
                            else if ((238 <= this.bits[j]) && (this.bits[j] <= 252)) {
                                val = buf.readUInt32LE()
                                global[`user_4u_${this.bits[j] - 237}`] = val
                                buf = buf.slice(4)
                            }
                            else if ((253 <= this.bits[j]) && (this.bits[j] <= 255)) {
                                val = buf.readUInt64LE()
                                global[`user_8u_${this.bits[j] - 252}`] = val
                                buf = buf.slice(8)
                            }
                            break;
                    }
                }
            }
            this.globalArrayMSG.push(global)
            //  console.log(this.globalArrayMSG)
            function funct2(buf, index) {
                let val = buf.readUInt8()
                global[`p_count${index}`] = val !== 255 ? val : 0
                buf = buf.slice(1)
                return buf
            }
            function funct(buf, index) {
                let val = buf.readUInt8()
                global[`tyres_number_${index}`] = val
                buf = buf.slice(1)
                val = buf.readUInt8()
                global[`tpms_pressure_${index}`] = val !== 0 ? (val * 0.1).toFixed(1) : 0
                buf = buf.slice(1)
                val = buf.readInt8()
                global[`tpms_temp_${index}`] = val !== -128 ? val : -128
                buf = buf.slice(1)

                return buf
            }
        }
    }



}

module.exports = ListenPortTP