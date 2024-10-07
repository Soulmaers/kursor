import { GetUpdateStruktura } from '../../../GetUpdateStruktura.js'


export class GetDataRequests {
    static getObjects() {
        const data = (GetUpdateStruktura.globalData).final
        const uniqData = Array.from(new Map(data.map(e => [e.object_id, { name: e.object_name, id: e.object_id, typeobject: e.typeobject, groupName: e.group_name }])).values())
        return uniqData
    }


    static async saveTemplates(obj) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ obj })
        }
        const res = await fetch('/api/saveTemplates', params)
        const result = await res.json()
        return result
    }

    static async updateTemplates(obj, id) {
        //   console.log(set)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ obj, id })
        }
        const res = await fetch('/api/updateTemplates', params)
        const result = await res.json()
        return result
    }


    static async getTemplates(id, prop) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, prop })
        }
        const res = await fetch('/api/getTemplates', params)
        const result = await res.json()
        return result
    }
    static async getAttributeTemplace(id) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id })
        }
        const res = await fetch('/api/getAttributeTemplace', params)
        const result = await res.json()
        return result
    }

    static async getReportsAttribute(idw) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw })
        }

        const result = await fetch('/api/getReportsAttribute', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async deleteTemplace(id) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id })
        }
        const res = await fetch('/api/deleteTemplace', params)
        const result = await res.json()
        return result
    }

    static async getReport(object) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/getReport', params)
        const result = await res.json()
        return result
    }
}