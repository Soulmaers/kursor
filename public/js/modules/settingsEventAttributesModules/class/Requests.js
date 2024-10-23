export class Requests {

    static async getSettings(idw) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw })
        }

        const result = await fetch('/api/getSettings', params)
        const response = await result.json()
        return response
    }

}