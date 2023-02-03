import { viewTech } from './requests.js'

export function tech() {
    const formValue = document.querySelectorAll('.formValue')
    const job = document.querySelectorAll('.job')
    console.log(formValue)
    formValue.forEach(i => {
        i.value = ''
    })
    job.forEach(i => i.textContent = '')
    const inputPSI = document.querySelector('.jobDav')
    const inputBar = document.querySelector('.bar')
    const techInfo = document.querySelector('.techInfo')
    techInfo.style.display = 'block'
    const probeg = document.querySelectorAll('.probeg')
    probeg.forEach(el => {
        el.addEventListener('input', () => {
            console.log(probeg[1].value)
            console.log(probeg[0].value)
            if (el = probeg[1]) {
                probeg[2].textContent = probeg[1].value - probeg[0].value
            }
        })
    })

    inputPSI.addEventListener('input', () => {
        inputBar.textContent = (inputPSI.value / 14.504).toFixed(1);
        console.log(inputBar.textContent)
    })
    const tyresActive = document.querySelector('.tiresActiv')
    viewTech(tyresActive.id);
    // fff()
}


var formTth = document.querySelectorAll('.formTth')
//Create array of options to be added
var marka = ["BFGoodrich", "Bridgestone", "Continental", "Cordiant", "Dunlop", "Cordiant", "Gislaved", "Goodyear", "Hankook", "Kumho", "Michelin"];
//Create and append select list
var selectList = document.createElement("datalist");
selectList.id = "suggestions";
selectList.name = "mySelect";
selectList.classList.add('selContent')
console.log(formTth[0])
formTth[0].appendChild(selectList);
//Create and append the options
//const option = document.document.querySelectorAll(".option");
//const option = document.createElement("option");
//option.classList.add('option')
//console.log(option)
//option.value = ''
//option.text = ''
//selectList.appendChild(option);
const input = document.createElement("input");
input.autoComplete = "on"
input.setAttribute('list', 'suggestions');
input.classList.add('formValue')
input.classList.add('techInput')
formTth[0].appendChild(input);



marka.forEach(el => {
    const option = document.createElement("option");
    // option.classList.add('option')
    option.value = el;
    option.text = el;
    selectList.appendChild(option);

})


/*
function combo() {
    const theinput = document.getElementById(ids);
    var idx = mySelect.selectedIndex;
    var content = mySelect.options[idx].innerHTML;
    theinput.value = content;
}
combo()*/