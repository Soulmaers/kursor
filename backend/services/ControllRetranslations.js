const databaseService = require('./database.service');

const WialonClassMethods = require('./WialonClassMethods')
const ListenPortTP = require('../modules/navtelecom/ChatServerTerminal.js');
const ListenPortTPNew = require('../modules/wialonRetranslation/ParseBuffer.js');
const ListenPortIPS = require('../modules/wialonIPS/ParseBuffer.js');
class ControllRetranslations {
    constructor() {

        this.init()
    }

    async init() {
        //   new ListenPortTP(21626);//21626
        //   new ListenPortIPS(20332)
        // new ListenPortTPNew(20163)
        await this.getProtokolRetranslation() //получение протоколов ретрансяции
        this.protokols.forEach(e => this.ifControllClassProtocol(e))
    }


    ifControllClassProtocol(e) {
        this.protokol = e.protokol
        switch (this.protokol) {
            case 'Wialon API': new WialonClassMethods(e)
                break;
            case 'Wialon Retranslation': new ListenPortTPNew(20163)
                break;
            //@ts-check  case 'Wialon IPS': new ListenPortIPS(20332)
            //   break;
        }
    }

    async getProtokolRetranslation() {
        this.protokols = await databaseService.getProtokolRetranslations()
        // console.log(this.protokols)
    }



}

module.exports = ControllRetranslations



