


export class RequestStaticMetods {

    static async setTyres(object) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/setTyres', params)
        const req = await res.json()
        return req
    }
    static async setModelTyres(arrayWheel, relId) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ arrayWheel, relId })
        }
        const res = await fetch('/api/setModelTyres', params)
        const uniqID = await res.json()
        return uniqID
    }
    static async findId() {
        const params = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const complete = await fetch('/api/findLastId', params)
        const result = await complete.json()
        let id;
        if (result.length === 0) {
            id = 1 + 'id'
        }
        else {
            const sortt = [...result[0].idw_tyres]
            console.log(sortt)
            sortt.forEach(el => {
                if (el === 'i') {
                    sortt.splice(sortt.indexOf(el), 2).join('')
                }
            })
            id = Number(sortt.join('')) + 1 + 'id'
        }
        return id
    }

    static async getModelTyres() {
        const params = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await fetch('/api/getModelTyres', params)
        const uniqID = await res.json()
        return uniqID

    }
    static async updateStatusTyres(id, flag, date) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id, flag, date })
        }
        const res = await fetch('/api/updateTyres', params)
        const uniqID = await res.json()
        return uniqID

    }

    static async getTyresToSlad() {
        const params = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await fetch('/api/getTyresToSlad', params)
        const uniqID = await res.json()
        return uniqID
    }

    static async getTyresPosition(obj) {
        const idObject = obj.idObject
        const identifikator = obj.identifikator
        console.log(idObject, identifikator)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idObject, identifikator })
        }
        const res = await fetch('/api/getTyresPosition', params)
        const result = await res.json()
        return result
    }

    static async setTyresHistory(object) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ object })
        }
        const res = await fetch('/api/setTyresHistory', params)
        const uniqID = await res.json()
        return uniqID

    }

    static async getHistoryTyresidTyres(idw) {
        const idw_tyres = idw
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idw_tyres })
        }
        const res = await fetch('/api/getHistoryTyresToID', param)
        const response = await res.json()
        return response
    }

    static async getParams(idw) {
        const param = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idw }))
        }
        const datas = await fetch('/api/getSens', param)
        this.params = await datas.json()
        const mileage = this.params.find(e => e.params === 'mileage')
        const res = mileage ? Number(mileage.value).toFixed(0) : '-'
        return res

    }

    static async saveDataToDB(formData) {
        try {
            const response = await fetch('/api/saveDataModelTyres', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            return 'Модель сохранена';
        } catch (error) {
            console.error('Error:', error);
        }
    }



    //новые методы
    static async getModelTyresGuide() {
        const params = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await fetch('/api/getModelTyresGuide', params)
        const uniqID = await res.json()
        return uniqID

    }

    static async findIdTyres() {
        const params = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const complete = await fetch('/api/findLastIdTyres', params);
        const result = await complete.json();
        let id;
        if (result.length === 0) {
            id = '1idt';
        } else {
            // Предполагаем, что idw_tyres это строка
            const lastId = result[0].idw_tyres;
            const idNumber = parseInt(lastId.replace('idt', ''), 10); // Удаляем 'idt' и превращаем в число
            id = (idNumber + 1) + 'idt'; // Увеличиваем число и добавляем 'idt'
        }
        return id;
    }

    static async saveDataToDBTyres(obj) {
        //console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ obj })
        }
        try {
            const response = await fetch('/api/saveDataToDBTyres', params);

            const result = await response.json();
            return 'Модель сохранена';
        } catch (error) {
            console.error('Error:', error);
        }
    }

    static async saveDataHistoryToDBTyres(obj) {
        //    console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ obj })
        }
        try {
            const response = await fetch('/api/saveDataHistoryToDBTyres', params);

            const result = await response.json();
            return 'Модель сохранена';
        } catch (error) {
            console.error('Error:', error);
        }
    }



    static async getAllTyres() {
        const params = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }
        const res = await fetch('/api/getAllTyres', params)
        const result = await res.json()
        return result
    }

    static async updateDataInDB(obj) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ obj })
        }
        const res = await fetch('/api/updateDataInDB', params)
        const result = await res.json()
        return result
    }

    static async updateTyreSklad(obj) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ obj })
        }
        const res = await fetch('/api/updateTyreSklad', params)
        const result = await res.json()
        return result
    }

    static async updateWheel(obj) {
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ obj })
        }
        const res = await fetch('/api/updateWheel', params)
        const result = await res.json()
        return result
    }

    static async updateFilterTable(idObject, idBitrix, id, pressure) {
        console.log(idObject, idBitrix, id, pressure)
        const params = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ idObject, idBitrix, id, pressure })
        }
        const res = await fetch('/api/updateFilterTable', params)
        const uniqID = await res.json()
        return uniqID

    }

}

