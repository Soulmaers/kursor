
import { viewList } from './spisok.js'
export const objViewContent = {
    set_one: 'account',
    set_two: 'listView',
    set_three: 'notification',
    set_four: 'contactSet'
}

const login = document.querySelectorAll('.log')[1].textContent
export function settingsRotate() {
    viewProfil(login)
    const navItem = document.querySelectorAll('.item_settings')
    const contentSet = document.querySelectorAll('.content_set')
    navItem.forEach(el => {
        el.addEventListener('click', () => {
            navItem.forEach(e => {
                e.classList.remove('active_set')
            })
            contentSet.forEach(e => {
                e.style.display = 'none'
            })
            el.classList.add('active_set')
            const navClick = document.querySelector(`.${objViewContent[el.getAttribute('rel')]}`)
            navClick.style.display = 'flex'
        })

    })

}








export const saveCheckListToBase = async (nums) => {
    const uniqBar = document.querySelectorAll('.uniqBar')
    const login = document.querySelectorAll('.log')[1].textContent
    const changeList = { login: login }

    const viewIcon = document.querySelectorAll('.viewIcon')
    const arrayIndexTitleList = []
    viewIcon.forEach((e, index) => {
        const relValues = e.getAttribute('rel').split(' ');
        const lastRel = relValues[relValues.length - 1];
        arrayIndexTitleList.push({ rel: lastRel, index: index })

    });
    uniqBar.forEach(el => {
        console.log(el)
        el.children[0].checked ? changeList[el.children[0].id] = true : changeList[el.children[0].id] = false
    })
    arrayIndexTitleList.forEach(el => {
        if (el.rel in changeList) {
            el.view = changeList[el.rel];
        } else {
            el.view = changeList['pressure'];
        }
    });
    const mass = arrayIndexTitleList.reduce((result, e) => {
        console.log(e)
        result[e.rel] = JSON.stringify(e);
        return result;
    }, {})
    mass.login = login
    console.log(mass)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ mass, login }))
    }
    const res = await fetch('/api/saveList', param)
    const results = await res.json()
    viewList(login)
    if (!nums) {
        eventSave()
    }

}
const buttonList = document.querySelector('.listView').lastElementChild
console.log(buttonList)
buttonList.addEventListener('click', () => saveCheckListToBase())

const viewProfil = async (login) => {
    document.querySelectorAll('.item_contact_set').forEach(it => it.remove())

    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))
    }
    const vals = await fetch('/api/findProfil', param)
    const val = await vals.json()
    const bodySet = document.querySelector('.body_set')
    val.result.forEach(el => {
        const newList = document.createElement('li');
        newList.classList.add('item_contact_set');
        newList.setAttribute('id', el.uniqId);
        newList.innerHTML = `
        <div class="view_email">${el.email}</div>
        <div class="view_phone">${el.phone}</div>
        <div class="icon_set"><i class="fas fa-trash-alt"></i></div>
    `;
        bodySet.appendChild(newList);
    })
    const close = document.querySelectorAll('.icon_set');
    if (close) {
        Array.from(close).forEach(e => {
            console.log(e)
            e.addEventListener('click', () => findIdClose(e))
        })
    }

}

export function jobFormSET() {
    const setForm = document.querySelector('.set_form')
    setForm.style.display = 'flex'
    const setFormButton = document.querySelector('.set_form_button');
    setFormButton.addEventListener('click', emailValidation)
}

export const findIdClose = async (e) => {
    const uniqId = e.parentNode.id
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ uniqId }))
    }
    const vals = await fetch('/api/deleteProfil/:id', param)
    const val = await vals.json()
    viewProfil(login)
}

const emailValidation = () => {
    const validTextInspect = document.querySelector('.valid_text')
    if (validTextInspect) {
        validTextInspect.remove();
    }
    const emailInput = document.querySelector('.email_set');
    const phoneInput = document.querySelector('.phone_set');
    // Приводим значение поля ввода email к нижнему регистру для упрощенной валидации.
    const email = emailInput.value.toLowerCase();
    const phone = phoneInput.value
    // Паттерн для валидации email-адреса.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const setForm = document.querySelector('.set_form')
    const validText = document.createElement('span')
    validText.classList.add('valid_text')
    setForm.appendChild(validText)

    const numberValid = validatePhoneNumber(phone)
    if (email === '' && phone === '') {
        validText.textContent = 'Добавьте контакты'
    }
    else if (!emailPattern.test(email) && email !== '') {
        validText.textContent = 'Введите корректный e-mail'
    }
    else if (!numberValid && phone !== '') {
        validText.textContent = 'Введите корректный номер'
    }
    else {
        viewListContact(email, phone)
    }
}
function validatePhoneNumber(number) {
    const regex = /^[7]\d{10}$/; // Регулярное выражение для проверки формата
    return regex.test(number);
}

async function viewListContact(email, phone) {
    const role = document.querySelectorAll('.log')[0].textContent
    document.querySelector('.set_form').style.display = 'none'
    document.querySelector('.email_set').value = ''
    document.querySelector('.phone_set').value = ''
    const account = document.querySelector('.settings_users')
    account.style.zIndex = 2;
    const newList = document.createElement('li');
    newList.classList.add('item_contact_set');
    const uniqId = Math.random().toString(36).substr(2, 5)
    const mass = []
    mass.push(uniqId)
    mass.push(login)
    mass.push(role)
    mass.push(email)
    mass.push(phone)
    console.log(mass)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ mass }))
    }
    const vals = await fetch('/api/saveProfil', param)
    const val = await vals.json()
    document.querySelectorAll('.item_contact_set').forEach(it => it.remove())
    viewProfil(login)
}




const buttonEvent = document.querySelector('.notification').lastElementChild
buttonEvent.addEventListener('click', () => saveCheckEventToBase())



function eventSave() {
    const confirm = document.querySelector('.confirm')
    console.log(confirm)
    confirm.style.display = 'flex'
    const account = document.querySelector('.settings_users')
    const pop = document.querySelector('.popup-background')
    pop.style.display = 'block'
    account.style.zIndex = 0
    setTimeout(() => {
        confirm.style.display = 'none'
        account.style.zIndex = 2
    }, 2000)
    confirm.children[0].children[0].addEventListener('click', () => {
        confirm.style.display = 'none'
        account.style.zIndex = 2
    })
}
async function saveCheckEventToBase() {
    eventSave()
    const celEvent = document.querySelectorAll('.celEven')
    const objEvent = {
        email: [],
        alert: [],
        what: [],
        teleg: [],
        sms: []
    };
    celEvent.forEach(el => {
        if (el.children[0].checked)
            objEvent[el.getAttribute('rel')].push(el.parentNode.firstElementChild.textContent)
    })
    for (let key in objEvent) {
        objEvent[key] = JSON.stringify(objEvent[key])
    }
    console.log(objEvent)

    const prms = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ objEvent, login }))
    }
    const res = await fetch('/api/saveEvent', prms)
    const result = await res.json()
    console.log(result)
}

const setThree = document.querySelector('.set_three')
setThree.addEventListener('click', viewCheckedEvent)


async function viewCheckedEvent() {
    const prms = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ login }))
    }
    const res = await fetch('/api/viewEvent', prms)
    const result = await res.json()
    console.log(result)
    delete result.itog[0].login
    delete result.itog[0].id
    const viewObj = result.itog[0]
    for (let key in viewObj) {
        viewObj[key] = JSON.parse(viewObj[key])
    }
    console.log(viewObj)
    const celEvent = document.querySelectorAll('.celEven')
    celEvent.forEach(e => {
        viewObj[e.getAttribute('rel')].forEach(it => {
            if (it === e.parentNode.firstElementChild.textContent) {
                e.children[0].checked = true
            }
        })
    })
}