
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








const saveCheckListToBase = async () => {
    const uniqBar = document.querySelectorAll('.uniqBar')
    const login = document.querySelectorAll('.log')[1].textContent
    const changeList = { login: login }
    uniqBar.forEach(el => {
        console.log(el)
        el.children[0].checked ? changeList[el.children[0].id] = true : changeList[el.children[0].id] = false
    })
    console.log(changeList)
    const param = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: (JSON.stringify({ changeList }))
    }
    const res = await fetch('/api/saveList', param)
    const results = await res.json()
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
    }, 3000)
    confirm.children[0].children[0].addEventListener('click', () => {
        confirm.style.display = 'none'
        account.style.zIndex = 2
    })
}
const buttonList = document.querySelector('.listView').lastElementChild
console.log(buttonList)
buttonList.addEventListener('click', saveCheckListToBase)


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
    const regex = /^[8]\d{10}$/; // Регулярное выражение для проверки формата
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



