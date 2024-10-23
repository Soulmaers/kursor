


export class Request {


    static async refill(idw, data) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idw, data })

        }
        const res = await fetch('/api/getRefills', params)
        const result = await res.json()
        return result

    }

}