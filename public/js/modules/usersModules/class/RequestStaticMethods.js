
export class Requests {


    static async findId(prefix) {
        const obj = {
            'idu': 'users',
            'ida': 'accounts'
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



    static async saveUser(obj) {
        const { idx, login, password, role, uz, creater } = obj
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idx, login, password, role, uz, creater }))
        }

        const result = await fetch('/signup', params)
        const response = await result.json()
        console.log(response)
        return response
    }
    static async saveAccount(obj) {
        const { idx, name, uniqCreater, uniqTP } = obj
        console.log(obj)
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idx, name, uniqCreater, uniqTP }))
        }

        const result = await fetch('/api/addAccount', params)
        const response = await result.json()
        console.log(response)
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

    static async deleteAccount(id, index) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, index })
        }
        const complete = await fetch('/api/deleteAccount', params)
        const result = await complete.json()
        return result
    }

}