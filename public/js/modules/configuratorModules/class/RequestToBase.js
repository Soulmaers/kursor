

export class RequestToBse {


    static async setConfigParam(obj) {
        const param = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ obj })
        }
        const res = await fetch('api/saveSetParams', param)
        const result = await res.json()
        return result
    }

    static async getConfigParam(idw, param) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, param })
        }
        const res = await fetch('api/getConfigParam', params)
        const result = await res.json()
        return result
    }
}