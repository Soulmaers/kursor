const databaseService = require('./database.service');

const WialonClassMethods = require('./WialonClassMethods')
class ControllRetranslations {
    constructor() {

        this.init()
    }

    async init() {
        await this.getProtokolRetranslation() //получение протоколов ретрансяции
        this.protokols.forEach(e => this.ifControllClassProtocol(e))
    }


    ifControllClassProtocol(e) {
        this.protokol = e.protokol

        switch (this.protokol) {
            case 'Wialon API': new WialonClassMethods(e)
                break;
            case 'Wialon Retranslation': null//new WialonRetranslation()
                break;
            case 'Wialon IPS': null//new WialonIPS()
                break;
        }
    }

    async getProtokolRetranslation() {
        this.protokols = await databaseService.getProtokolRetranslations()
        console.log(this.protokols)
    }
}



module.exports = ControllRetranslations