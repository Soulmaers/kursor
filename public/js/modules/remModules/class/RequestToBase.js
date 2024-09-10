

export class RequestToBase {



    static async getIdObject(array) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ array })
        }

        const res = await fetch('/api/getOldObjects', params)
        const data = await res.json()
        return data
    }


    static async updateIdOBjectToBase(arrayId, storTable) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ arrayId, storTable })
        }

        const res = await fetch('/api/updateIdOBjectToBase', params)
        const mess = await res.json()
        return mess
    }
}

