


let form = document.querySelector('.form')
let formin = document.querySelector('.auth_form')
// Заменим обработчик submit формы
/*
form.addEventListener("submit", function (e) {
    // отключим поведение по умолчанию
    e.preventDefault();
    let formAuth = new FormData(form);
    formAuth = JSON.stringify(Object.fromEntries(formAuth));
    console.log(formAuth)
    fetch('/api/auth/signup', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: formAuth,
    })
        .then((res) => res.json())
        .then((res) => {
            let user = res;
            console.log(user.values.message);
            // localStorage.setItem("user", JSON.stringify(user));
            // user = localStorage.getItem("user");
            // console.log("user", JSON.parse(user));
        });
});*/

formin.addEventListener("submit", function (e) {
    // отключим поведение по умолчанию
    e.preventDefault();
    let formAuth = new FormData(formin);
    formAuth = JSON.stringify(Object.fromEntries(formAuth));
    console.log(formAuth)
    fetch('/api/auth/signin', {
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
            // localStorage.setItem("user", JSON.stringify(user));
            // user = localStorage.getItem("user");
            console.log(user.values.message);
            console.log(user.values.token);
            views(user)
            //console.log("user", JSON.parse(user));
        })

});


function views(token) {
    console.log(token)
    fetch('api/users', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token.values.token}`
        }
    })
        .then((res) => res.json())
        .then((res) => {
            let user = res;
            console.log(user);
            modals(user.values)
        })
}


function modals(list) {
    for (let i = 0; i < list.length; i++) {
        const ul = document.createElement('ul');
        document.body.append(ul)
        for (let key of Object.keys(list[i])) {
            const li = document.createElement('li');
            li.textContent = (key + " : " + list[i][key])
            document.body.appendChild(li)
        }
    }
}
