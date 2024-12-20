const databaseService = require('../../services/database.service');
const fs = require('fs');
const net = require('net');




const JobToBase = require('./JobToBase')
class NavtelecomResponceData {

    static bufferAssembly(peamble, receiver, sender, message) { //подготовка ответных сообщений
        const responceHead = Buffer.concat([peamble, sender, receiver, message.lengthMsg, Buffer.from([message.crc])])
        const crcHeas = CheckSumm.xorSum(responceHead, responceHead.length)
        const responce = Buffer.concat([responceHead, Buffer.from([crcHeas]), message.msg])
        return responce
    }

    static assemblingMSG(msg) {
        const message = msg //собираем данные сообщения
        let buffer = Buffer.from(message, 'utf-8')
        const crc = CheckSumm.xorSum(buffer, buffer.length) //считаем контрольную сумму
        const lengthInBytes = Buffer.alloc(2);
        lengthInBytes.writeUInt16LE(buffer.length, 0)
        return ({ msg: buffer, crc: crc, lengthMsg: lengthInBytes })
    }
}


class CheckSumm { //подсчет контрольных сумм

    static xorSum(buffer) {
        let tempSum = 0;
        for (let i = 0; i < buffer.length; i++) {
            tempSum ^= buffer[i];
        }
        return tempSum;
    }
    static crc8(buffer) {
        let crc = 0xFF;
        for (let i = 0; i < buffer.length; i++) {
            crc ^= buffer[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x80) !== 0 ? (crc << 1) ^ 0x31 : crc << 1;
                crc = crc & 0xFF; // Ensure 8-bit value
            }
        }
        return crc;
    }
}

class BitsCount { // расчет битов
    static check(number, index) {
        return (number & (1 << index)) !== 0;
    }
    static between(number, from, to) {
        return (number >> from) & ((1 << (to - from)) - 1);
    }
    static from(number, from) {
        return number >> from;
    }
    static to(number, to) {
        return between(number, 0, to);
    }
}



class WriteFile { //запись расшифрованных данных в файл txt
    static async writeDataFile(globalArrayMSG, imei) {
        const res = await databaseService.objectsImei(String(imei))
        if (res.length !== 0) {
            globalArrayMSG.map(e => {
                e.idObject = res[0].idObject
            })
            const table = 'navtelecom'
            const obj = new JobToBase()
            //   obj.createTable(table)
            for (const msg of globalArrayMSG) {
                await obj.fillingTableColumns(msg, table)
                await obj.fillingTableRows(msg, table)
            }
        }
    }
}

module.exports = {
    NavtelecomResponceData,
    CheckSumm,
    BitsCount,
    WriteFile
}