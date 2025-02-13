import { Helpers } from './modules/spisokModules/class/Helpers.js'
import { SimpleEventEmitter } from './Emitter.js'
export class GetUpdateStruktura {

    static globalData = null
    static resourseData = null
    static propertyResourse = null
    static async zaprosData() {
        const role = document.querySelector('.role').getAttribute('rel')
        const incriment = document.querySelector('.role').getAttribute('data-att')
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment, role }))

        }
        const mods = await fetch('/api/dannie', params)
        const models = await mods.json()
        const arrayList = models.result

        const allId = Helpers.format(arrayList, 0)
        const final = Helpers.format(arrayList, 1)
        const groupId = Helpers.format(arrayList, 2)
        const finalGroup = Helpers.format(arrayList, 3)

        GetUpdateStruktura.globalData = { data: arrayList, allId: allId, final: final, groupId: groupId, finalGroup: finalGroup }
        // Вызываем событие 'dataReceived' с полученными данными
        SimpleEventEmitter.emit('dataReceived', { data: arrayList, allId, final, groupId });
        return { data: arrayList, allId: allId, final: final, groupId: groupId, finalGroup: finalGroup }

    }

    // Метод для подписки на события
    static onDataReceived(callback) {
        SimpleEventEmitter.on('dataReceived', callback);
    }
    static updateData() {
        setInterval(async () => await GetUpdateStruktura.zaprosData(), 120000)
    }

    static async getAccountResourse(incriment, role) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment, role }))

        }
        const mods = await fetch('/api/getAccountResourseID', params)
        const models = await mods.json()
        GetUpdateStruktura.resourseData = models
    }
    static async getPermissions(incriment) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment }))

        }
        const mods = await fetch('/api/getPropertyPermissions', params)
        const models = await mods.json()
        GetUpdateStruktura.propertyResourse = models
    }

}