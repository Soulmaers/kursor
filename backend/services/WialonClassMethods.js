const wialonModule = require('../modules/wialon.module');
const wialonService = require('./wialon.service');
const databaseRetranslation = require('./databaseRetranslation.service');
const WialonOrigin = require('../modules/wialon/WialonOrigin.js');
class WialonClassMethods {
    constructor(retranslation) {
        this.retranslation = retranslation
        this.token = retranslation.tokenRetra
        this.uz = retranslation.uz
        this.uniqRetraID = retranslation.incriment
        this.creater = retranslation.protokol
        this.nameRetra = retranslation.nameRetra
        this.instance = null
        this.init()
    }

    async init() {
        try {
            await this.fetchSession(); // Ждем, пока сессия будет получена
            // console.log(this.session)
            console.log('тут;')
            await this.getObjects();
            await this.addGroup();

            this.controllStartClass();
            setInterval(() => this.controllStartClass(), 180000);
        } catch (error) {
            console.error('Ошибка при инициализации WialonClassMethods:', error);
            throw error;
        }
    }

    async fetchSession() {
        while (!this.session) {
            try {
                await this.getSessionWialon();
            } catch (error) {
                console.error("Ошибка при получении сессии:", error);
            }
            if (!this.session) {
                console.log("Сессия не получена, повторная попытка через 60 секунд...");
                await new Promise(resolve => setTimeout(resolve, 60000)); // Ждем 60 секунд перед повтором
            }
        }
    }


    controllStartClass() {
        if (this.instance) {
            this.instance.inits()
        }
        else {
            this.instance = new WialonOrigin(this.session);
        }

    }
    async getSessionWialon() {
        this.session = await wialonModule.login(`"39e1405494b595e6890a684bdb998c65EA58006309FF667A6B6108AEBD25C2DF93CDFAA2"`);
        console.log(this.session.eid)
    }

    async getObjects() {
        const [propertyObjects, propertyGroups] = await Promise.all([
            //    wialonService.getDataFromWialon(this.session),
            wialonService.getPropertyObjects(this.session),
            wialonService.getPropertyGroups(this.session)
        ]);
        this.propertyObjects = propertyObjects ? propertyObjects.map(e => ({ idx: e.id, objectname: e.nm, phonenumber: e.ph, imeidevice: e.uid, uz: this.uz, nameRetra: this.nameRetra, uniqRetraID: this.uniqRetraID })) : []
        this.propertyGroups = propertyGroups ? propertyGroups.map(e => ({ idx: e.id, nameGroup: e.nm, uz: this.uz, arrayIdObjects: e.u, nameRetra: this.nameRetra, uniqRetraID: this.uniqRetraID })) : []
        // Создаем allObjects
        this.allObjects = this.propertyGroups.map(group => {
            const filteredObjects = this.propertyObjects.filter(obj => group.arrayIdObjects.includes(obj.idx));
            return {
                ...group,
                arrayIdObjects: filteredObjects
            };
        });
    }

    async addGroup() {
        //  console.log(this.allObjects)
        try {
            if (this.allObjects.length === 0 || !this.allObjects) return
            await Promise.all([await databaseRetranslation.updateFlagForExistingObjects(this.uniqRetraID, 'groups'),
            await databaseRetranslation.updateFlagForExistingObjects(this.uniqRetraID, 'objects')]);

            const promises = this.allObjects.map(async el => {
                await databaseRetranslation.addGroups(el);
            });
            await Promise.all(promises);
            await databaseRetranslation.deleteObjects('groups')
            await databaseRetranslation.deleteObjects('objects')
        } catch (error) {
            console.error('Ошибка при добавлении групп в базу данных:', error);
            throw error;
        }
    }
}

module.exports = WialonClassMethods