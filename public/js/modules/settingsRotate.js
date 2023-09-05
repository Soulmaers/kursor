


export const objViewContent = {
    set_one: 'account',
    set_two: 'listView',
    set_three: 'notification',
    set_four: 'contactSet'
}


export function settingsRotate() {
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


export function jobFormSET() {
    const setForm = document.querySelector('.set_form')
    setForm.style.display = 'flex'

    const setFormButton = document.querySelector('.set_form_button');
    setFormButton.addEventListener('click', emailValidation)

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
    validText.style.color = 'red'
    validText.style.fontSize = '0.7rem'

    validText.style.width = '150px'
    validText.style.position = 'absolute'
    validText.style.top = '84%'
    validText.style.left = '5%'
    setForm.appendChild(validText)


    // Валидация значение поля email.
    if (email === '' && phone === '') {
        validText.textContent = 'Добавьте контакты'
    }
    else if (!emailPattern.test(email)) {
        validText.textContent = 'Введите корректный e-mail'
    }
    else {
        console.log('ne ok')

    }
}




