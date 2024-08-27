
export class Requests {


    static async findId(prefix) {
        const obj = {
            'idu': 'users',
            'ida': 'accounts',
            'ido': 'objects',
            'idg': 'groups',
            'idr': 'retranslations'
        };
        const table = obj[prefix];
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ table })
        };

        try {
            const complete = await fetch('/api/findLastIdUser', params);
            const result = await complete.json();

            let id = 1;

            if (result.length > 0) {
                // Находим последний idx
                const lastIdx = result[0].idx;

                // Извлекаем числовую часть из строки idx, игнорируя префикс
                const lastNumber = parseInt(lastIdx.replace(/\D/g, ''), 10); // Удаляем все нецифровые символы

                // Увеличиваем число на 1 для получения нового id
                id = lastNumber + 1;
            }
            console.log(`${id}${prefix}`)
            return `${id}${prefix}`; // Формируем новый idx с учетом префикса
        } catch (error) {
            console.error('Error fetching last idx:', error);
            return null; // Обработка ошибки, если не удалось получить последний idx
        }
    }



    static async saveUser(obj, objects, groups) {
        const { idx, login, password, role, uz, creater } = obj
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj, objects, groups }))
        }

        const result = await fetch('/signup', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async editUser(obj) {
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify(obj))
        }

        const result = await fetch('/api/editUser', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async editRetra(obj) {
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify(obj))
        }

        const result = await fetch('/api/editRetra', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async setHistory(obj) {
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ obj })
        }

        const result = await fetch('/api/setHistorys', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async updateObjectUser(incriment, objects) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment, objects }))
        }

        const result = await fetch('/api/updateObjectUser', params)
        const response = await result.json()
        console.log(response)
        return response
    }


    static async deleteUsersObjectGroupRetra(obj) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj }))
        }

        const result = await fetch('/api/deleteUsersObjectGroupRetra', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async updateGroupUser(incriment, groups) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment, groups }))
        }

        const result = await fetch('/api/updateGroupUser', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async editObject(obj) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj }))
        }

        const result = await fetch('/api/editObject', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async editGroup(obj) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj }))
        }

        const result = await fetch('/api/editGroup', params)
        const response = await result.json()
        console.log(response)
        return response
    }


    static async updateObjectsAndUsers(obj) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj }))
        }

        const result = await fetch('/api/updateObjectsAndUsers', params)
        const response = await result.json()
        console.log(response)
        return response
    }


    static async updateGroupsAndUsers(incriment, objects, action) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment, objects, action }))
        }

        const result = await fetch('/api/updateGroupsAndUsers', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async saveAccount(obj) {
        const { idx, name, uniqCreater, uniqTP, idu, password, role } = obj
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idx, name, uniqCreater, uniqTP, idu, password, role }))
        }

        const result = await fetch('/api/addAccount', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async editAccount(obj) {
        const { incriment, name, uniqCreater, uniqTP, oldUniqCreator } = obj
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment, name, uniqCreater, uniqTP, oldUniqCreator }))
        }

        const result = await fetch('/api/editAccount', params)
        const response = await result.json()
        console.log(response)
        return response
    }


    static async saveObject(obj, role) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ obj, role })
        }

        const result = await fetch('/api/addObject', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async saveGroup(obj, arrayObjects, role) {
        console.log(obj, arrayObjects)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ obj, arrayObjects, role })
        }

        const result = await fetch('/api/addGroup', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async saveRetra(obj) {

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj }))
        }

        const result = await fetch('/api/addRetra', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async getHistoryStor(obj) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ obj }))
        }
        const result = await fetch('/api/getHistoryStor', params)
        const response = await result.json()
        return response
    }

    static async getAcc() {
        const params = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const result = await fetch('/api/geAccContent', params)
        const response = await result.json()
        console.log(response)
        return response
    }

    static async getObjectsGroups(incriment) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ incriment }))
        }

        const result = await fetch('/api/getObjectsGroups', params)
        const response = await result.json()
        return response
    }


    static async getUsers(role, creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role, creater })
        }
        const complete = await fetch('/api/getUsers', params)
        const result = await complete.json()
        return result
    }
    static async getAccounts(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getAccounts', params)
        const result = await complete.json()
        return result
    }
    static async getAccountUsers(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getAccountUsers', params)
        const result = await complete.json()
        return result
    }

    static async getUsersContent(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getUsersContent', params)
        const result = await complete.json()
        return result
    }


    static async getAccountCreater(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getAccountCreater', params)
        const result = await complete.json()
        return result
    }

    static async getObjectCreater(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getObjectCreater', params)
        const result = await complete.json()
        return result
    }

    static async getRetraCreater(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getRetraCreater', params)
        const result = await complete.json()
        return result
    }


    static async getGroupCreater(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getGroupCreater', params)
        const result = await complete.json()
        return result
    }
    static async getCountGroups(creater) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creater })
        }
        const complete = await fetch('/api/getCountGroups', params)
        const result = await complete.json()
        return result
    }

    static async deleteAccount(id, index, role, uniqCreator) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, index, role, uniqCreator })
        }
        const complete = await fetch('/api/deleteAccount', params)
        const result = await complete.json()
        return result
    }

}