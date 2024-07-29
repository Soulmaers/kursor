const wialonModule = require('../modules/wialon.module');
const wialonService = require('./wialon.service');
const databaseRetranslation = require('./databaseRetranslation.service');
class WialonClassMethods {
    constructor(retranslation) {
        this.retranslation = retranslation
        this.token = retranslation.tokenRetra
        this.uz = retranslation.uz
        this.uniqRetraID = retranslation.incriment
        this.creater = retranslation.protokol
        this.nameRetra = retranslation.nameRetra
        this.init()
    }

    async init() {
        try {
            await this.getSessionWialon();
            await this.getObjects();

            await this.addGroup();
        } catch (error) {
            console.error('Ошибка при инициализации WialonClassMethods:', error);
            throw error;
        }
    }

    async getSessionWialon() {
        this.session = await wialonModule.login('0f481b03d94e32db858c7bf2d8415204977173E354D49AA7AFA37B01431539AEAC5DAD5E');
    }

    async getObjects() {
        const [data, propertyObjects, propertyGroups] = await Promise.all([
            wialonService.getDataFromWialon(this.session),
            wialonService.getPropertyObjects(this.session),
            wialonService.getPropertyGroups(this.session)
        ]);
        this.propertyObjects = propertyObjects.map(e => ({ idx: e.id, objectname: e.nm, phonenumber: e.ph, imeidevice: e.uid, uz: this.uz, nameRetra: this.nameRetra, uniqRetraID: this.uniqRetraID }));
        this.propertyGroups = propertyGroups.map(e => ({ idx: e.id, nameGroup: e.nm, uz: this.uz, arrayIdObjects: e.u, nameRetra: this.nameRetra, uniqRetraID: this.uniqRetraID }));
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
        try {
            await Promise.all([await databaseRetranslation.updateFlagForExistingObjects(this.uniqRetraID, 'groups'),
            await databaseRetranslation.updateFlagForExistingObjects(this.uniqRetraID, 'objects')]);

            const promises = this.allObjects.map(async el => {
                await databaseRetranslation.addGroups(el);
            });
            await Promise.all(promises);
        } catch (error) {
            console.error('Ошибка при добавлении групп в базу данных:', error);
            throw error;
        }
    }
}

module.exports = WialonClassMethods