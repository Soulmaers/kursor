//import { v4 as uuidv4 } from 'https://jspm.dev/uuid'


const btnSignup = document.querySelector('.btn-warning')
btnSignup.addEventListener('click', account)


async function account() {
    const idx = (Math.random() * 10000).toFixed(0) + 'id'

    const formControl = document.querySelectorAll('.form-control')
    const select = document.getElementById('select')
    const login = formControl[0].value
    const pass = formControl[1].value
    const role = select.value
    console.log(login, pass, role)
    if (!login) {
        const messaga = document.querySelector('.message')
        messaga.textContent = 'Не указан логин!'
        messaga.style.color = 'red'
        setTimeout(() => messaga.textContent = '', 2000)
        return
    }
    if (!pass) {
        const messaga = document.querySelector('.message')
        messaga.textContent = 'Не указан пароль!'
        messaga.style.color = 'red'
        setTimeout(() => messaga.textContent = '', 2000)
        return
    }
    if (role === 'Укажите права доступа') {
        console.log('условия')
        console.log('Не выбраны права доступа!')
        const messaga = document.querySelector('.message')
        messaga.textContent = 'Не выбраны права доступа!'
        messaga.style.color = 'red'
        setTimeout(() => messaga.textContent = '', 2000)
        return
    }
    if (login && pass && role !== 'Укажите права доступа') {

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: (JSON.stringify({ idx, login, pass, role }))
        }

        const result = await fetch('/signup', params)
        const response = await result.json()
        console.log(response)
        const messaga = document.querySelector('.message')
        var options = document.querySelectorAll('opt');

        if (response.status == 200) {
            messaga.textContent = 'Пользователь добавлен!'
            messaga.style.color = 'green'
            setTimeout(() => messaga.textContent = '', 2000)
        }
        else {
            messaga.textContent = response.message.message
            messaga.style.color = 'red'
            setTimeout(() => messaga.textContent = '', 2000)
        }
        select.firstElementChild.selected = true;
        formControl.forEach(e => {
            e.value = ''
        })
        getUsers()
    }
}


export async function getUsers() {
    console.log('гетзерс')
    const params = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const data = await fetch('/users', params)
    console.log(data)
    const users = await data.json()
    console.log(users.result)
    const items = document.querySelectorAll('.users')
    console.log(new Date())
    console.log(items)
    if (items) {
        items.forEach(el => {
            el.remove()
        })
    }
    const listAccountReal = document.querySelector('.listAccountReal')
    users.result.forEach(e => {
        const item = document.createElement('li')
        item.classList.add('users')

        listAccountReal.appendChild(item)
        const log = document.createElement('span')
        log.classList.add('login')
        log.textContent = e.name
        const role = document.createElement('span')
        role.classList.add('role')
        const crud = document.createElement('span')
        crud.classList.add('crud')
        role.textContent = e.role
        const icon1 = document.createElement('span')
        icon1.classList.add('icon1')
        icon1.setAttribute('id', `${e.idx}`)
        const icon2 = document.createElement('icon2')
        icon2.classList.add('icon2')
        icon2.setAttribute('id', `${e.idx}`)
        item.appendChild(log)
        item.appendChild(role)
        item.appendChild(crud)
        crud.appendChild(icon1)
        crud.appendChild(icon2)
    })
    const confirm = document.querySelector('.clearConfirm')
    const deletUser = document.querySelectorAll('.icon2')
    const noDeleteUser = document.querySelector('.net')
    const deleteUser = document.querySelector('.da')
    deletUser.forEach(el => {
        console.log(el)
        el.addEventListener('click', () => {
            deletUser.forEach(el => {
                el.classList.remove('btna')
            })
            el.classList.add('btna')
            confirm.style.display = 'flex'
        })
    })
    noDeleteUser.addEventListener('click', () => {
        deletUser.forEach(el => {
            if (el.classList.contains('btna')) {
                el.classList.remove('btna')
                confirm.style.display = 'none';
            }
        })
    })
    deleteUser.addEventListener('click', () => {
        deletUser.forEach(el => {
            if (el.classList.contains('btna')) {
                console.log(el)
                confirm.style.display = 'none';
                deleteFn(el.id);
            }
        })
    })
    console.log(new Date())
    console.log(items)
    updateFn()
}


function updateFn() {
    const deletUser = document.querySelectorAll('.icon1')
    const sigup = document.querySelectorAll('.sigup')
    console.log(deletUser)
    deletUser.forEach(el => {
        //console.log(el)
        el.addEventListener('click', async () => {
            console.log('клик')
            const login = el.closest('.users').children[0].textContent
            console.log(el.closest('.users').children[0].textContent);
            console.log(sigup)
            sigup[0].innerHTML = `<div class="form-group">
            <label>Логин</label>
            <input type="text" class="form-control" value=${login} name="username">
            </div>
            <div class="form-group">
            <label>Права доступа</label>
            <select class="sel" id="select">
                <option class="opt" selected disabled>Укажите права доступа</option>
                <option class="opt" value="Пользователь" name="role">Пользователь</option>
                <option class="opt" value="Администратор" name="role">Администратор</option>
            </select>
            </div>
            <div class="btnWrap">
            <button class="btn-up btn-lg">Сохранить</button>
            </div>`
            const btnUp = document.querySelector('.btn-up')
            const select = document.getElementById('select')
            const formControl = document.querySelectorAll('.form-control')
            const idx = el.id
            btnUp.addEventListener('click', async () => {
                const log = formControl[0].value
                const role = select.value
                sigup[0].innerHTML = `<div class="form-group">
                <label>Логин</label>
                <input type="text" class="form-control" name="username">
            </div>
            <div class="form-group">
                <label>Пароль</label>
                <input type="password" class="form-control" name="password">
            </div>
            <div class="form-group">
                <label>Права доступа</label>
                <select class="sel" id="select">
                    <option class="opt" selected disabled>Укажите права доступа</option>
                    <option class="opt" value="Пользователь" name="role">Пользователь</option>
                    <option class="opt" value="Администратор" name="role">Администратор</option>
                </select>
            </div>
            <div class="btnWrap">
                <button class="btn-warning btn-lg">Добавить</button>
            </div>`

                if (!log) {
                    const messaga = document.querySelector('.message')
                    messaga.textContent = 'Не указан логин!'
                    messaga.style.color = 'red'
                    setTimeout(() => messaga.textContent = '', 2000)
                    return
                }

                if (role === 'Укажите права доступа') {
                    console.log('условия')
                    console.log('Не выбраны права доступа!')
                    const messaga = document.querySelector('.message')
                    messaga.textContent = 'Не выбраны права доступа!'
                    messaga.style.color = 'red'
                    setTimeout(() => messaga.textContent = '', 2000)
                    return
                }
                if (login && role !== 'Укажите права доступа') {
                    const params = {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ idx, log, role })
                    }
                    const data = await fetch('/update/:id', params)
                    console.log(data)
                    const result = await data.json()
                    const messaga = document.querySelector('.message')
                    messaga.textContent = result.message
                    messaga.style.color = 'green'
                    setTimeout(() => messaga.textContent = '', 2000)

                    getUsers()
                }
            })
        })

    })
    const formControl = document.querySelectorAll('.form-control')
    const select = document.getElementById('select')
    select.firstElementChild.selected = true;
    formControl.forEach(e => {
        e.value = ''
    })
}




export async function deleteFn(id) {
    const idx = id
    const params = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idx }),
    }
    const data = await fetch('/delete/:id', params)
    const result = await data.json()
    const messaga = document.querySelector('.message')
    messaga.textContent = result.message
    messaga.style.color = 'green'
    setTimeout(() => messaga.textContent = '', 2000)
    const formControl = document.querySelectorAll('.form-control')
    const select = document.getElementById('select')
    select.firstElementChild.selected = true;
    formControl.forEach(e => {
        e.value = ''
    })
    getUsers()
}







export function checkCreate(nameCar) {
    const box = document.querySelector('.check_boxs')
    const activePost = nameCar.replace(/\s+/g, '')
    const list = document.createElement('p')
    list.classList.add('listTitles')
    list.innerHTML = `<input class="checkIn" type="checkbox" rel=${activePost}
    value=${activePost} id=${activePost}Check>${activePost}`
    box.appendChild(list)

}


const close = document.querySelector('.close')
close.addEventListener('click', () => {
    const profilUser = document.querySelector('.profilUser')
    profilUser.style.display = 'none'
})



export function profil(name, role) {
    const profilUser = document.querySelector('.profilUser')
    profilUser.style.display = 'flex'
    const accountControll = document.querySelector('.accountControll')
    accountControll.style.display = 'flex'
    const nameUser = document.querySelector('.nameUser')
    const userRole = document.querySelector('.userRole')
    nameUser.textContent = name
    userRole.textContent = role


}