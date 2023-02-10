


let formin = document.querySelector('.auth_form')
formin.addEventListener("submit", function (e) {
    // отключим поведение по умолчанию
    e.preventDefault();
    let formAuth = new FormData(formin);
    formAuth = JSON.stringify(Object.fromEntries(formAuth));
    console.log(formAuth)
    fetch('/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: formAuth,
    })
        .then((res) => res.json())
        .then((res) => {
            let user = res;
            console.log(user);

            views(user)

        })

});


function views(token) {
    console.log(token)
    fetch('/profile', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.values.token}`
        }
    })
    //   window.location.replace(res.values.message)


    //  })

}

// console.log(res.sendFile(path.resolve(__dirname, '../../public/in.html')));
/*
function modals() {

    fetch('/cont', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',

        }
    })*/
/*
    const contStart = document.querySelector('.container_start')
    const header = document.querySelector('.header')
    const main = document.querySelector('.main')
    const menu = document.querySelector('.menu')
    contStart.style.display = 'none';
    header.style.display = 'block';
    main.style.display = 'flex';
 
    const ul = document.createElement('ul');
    ul.classList.add('user')
    menu.append(ul)
    const li = document.createElement('li');
    li.textContent = (`Пользователь : ${list}`)
    ul.appendChild(li)*/



