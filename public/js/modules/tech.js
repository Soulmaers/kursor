import { viewTech } from './requests.js'



export function radCecked() {
    const rad = document.querySelectorAll('[name=radio]')

    rad[0].checked === true;
}

export function tech() {
    const modalCenterOs = document.querySelector('.modalCenterOs')
    modalCenterOs.style.display = 'none';
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
    //techInfo.style.display = 'block'
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

}

/*
let x = 0;
let y = 86
let z = 120 - 102
let canvas = document.getElementById('drawLine');
let ctx = canvas.getContext('2d')

ctx.moveTo(0, y);
// команда рисования линии с координатами конца линии
ctx.lineTo(350, z);
ctx.strokeStyle = "black"; //цвет линии
ctx.lineWidth = "2"; //толщина линии
ctx.stroke(); // обводка линии 
*/
/*
var c = document.getElementById("drawLine");
var ctx = c.getContext("2d");

ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(0, 60);
ctx.lineTo(0, 17);
ctx.lineTo(346, 9);
ctx.lineTo(346, 60);
ctx.lineTo(173, 60);

ctx.lineTo(0, 60);
ctx.fillStyle = "rgba(204,85,0, 0.5)";
ctx.fill();
ctx.stroke();

ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(0, 0);
ctx.lineTo(0, 50);
ctx.lineTo(4, 50);
ctx.lineTo(9, 0);
ctx.fillStyle = "rgba(255,255,255, 1)";
ctx.fill();
ctx.stroke();

ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(346, 0);
ctx.lineTo(346, 50);
ctx.lineTo(342, 50);
ctx.lineTo(337, 0);
ctx.fillStyle = "rgba(255,255,255, 1)";
ctx.fill();
ctx.stroke();


ctx.beginPath();
ctx.lineWidth = "1";
ctx.strokeStyle = "#000";
ctx.moveTo(164, 0);
ctx.lineTo(169, 50);
ctx.lineTo(176, 50);
ctx.lineTo(181, 0);
ctx.fillStyle = "rgba(255,255,255, 1)";
ctx.fill();
ctx.stroke();


*/


/*
var c22 = document.getElementById("drawLine22");
var ctx22 = c22.getContext("2d");
ctx22.beginPath();
ctx22.lineWidth = "0.01";
ctx22.strokeStyle = "#000";
ctx22.moveTo(0, 60);
ctx22.lineTo(0, 20);
ctx22.lineTo(116, 10);
ctx22.lineTo(116, 60);
ctx22.lineTo(0, 60);
//ctx2.lineTo(0, 60);
ctx22.fillStyle = "rgba(255,255,0, 0.5)";
ctx22.fill();
ctx22.stroke();

ctx22.beginPath();
ctx22.lineWidth = "0.01";
ctx22.strokeStyle = "#000";
ctx22.moveTo(0, 0);
ctx22.lineTo(0, 50);
ctx22.lineTo(5, 50);
ctx22.lineTo(10, 0);
ctx22.lineTo(0, 0);
//ctx2.lineTo(0, 60);
ctx22.fillStyle = "rgba(255,255,255, 1)";
ctx22.fill();
//ctx2.stroke();

ctx22.beginPath();
ctx22.lineWidth = "0.01";
ctx22.strokeStyle = "#000";
ctx22.moveTo(116, 50);
ctx22.lineTo(111, 50);
ctx22.lineTo(106, 0);
ctx22.lineTo(116, 0);
//ctx2.lineTo(0, 60);
ctx22.fillStyle = "rgba(255,255,255, 1)";
ctx22.fill();
ctx22.stroke();



//lдоп. функционал 3 сегмента
var c33 = document.getElementById("drawLine33");
var ctx33 = c33.getContext("2d");
ctx33.beginPath();
ctx33.lineWidth = "0.01";
ctx33.strokeStyle = "#000";
ctx33.moveTo(0, 10);
ctx33.lineTo(116, 10);
ctx33.lineTo(116, 60);
ctx33.lineTo(0, 60);
ctx33.fillStyle = "rgba(0,128,0, 0.5)";
ctx33.fill();

ctx33.beginPath();
ctx33.lineWidth = "0.01";
ctx33.strokeStyle = "#000";
ctx33.moveTo(0, 0);
ctx33.lineTo(0, 50);
ctx33.lineTo(5, 50);
ctx33.lineTo(10, 0);
ctx33.lineTo(0, 0);
//ctx2.lineTo(0, 60);
ctx33.fillStyle = "rgba(255,255,255, 1)";
ctx33.fill();
//ctx2.stroke();

ctx33.beginPath();
ctx33.lineWidth = "0.01";
ctx33.strokeStyle = "#000";
ctx33.moveTo(116, 50);
ctx33.lineTo(111, 50);
ctx33.lineTo(106, 0);
ctx33.lineTo(116, 0);
//ctx2.lineTo(0, 60);
ctx33.fillStyle = "rgba(255,255,255, 1)";
ctx33.fill();
ctx33.stroke();


var c44 = document.getElementById("drawLine44");
var ctx44 = c44.getContext("2d");
ctx44.beginPath();
ctx44.lineWidth = "0.01";
ctx44.strokeStyle = "#000";
ctx44.moveTo(0, 10);
ctx44.lineTo(116, 30);
ctx44.lineTo(116, 60);
ctx44.lineTo(0, 60);
ctx44.fillStyle = "rgba(255,0,0, 0.5)";
ctx44.fill();

ctx44.beginPath();
ctx44.lineWidth = "0.01";
ctx44.strokeStyle = "#000";
ctx44.moveTo(0, 0);
ctx44.lineTo(0, 50);
ctx44.lineTo(5, 50);
ctx44.lineTo(10, 0);
ctx44.lineTo(0, 0);
//ctx2.lineTo(0, 60);
ctx44.fillStyle = "rgba(255,255,255, 1)";
ctx44.fill();
//ctx2.stroke();

ctx44.beginPath();
ctx44.lineWidth = "0.01";
ctx44.strokeStyle = "#000";
ctx44.moveTo(116, 50);
ctx44.lineTo(111, 50);
ctx44.lineTo(106, 0);
ctx44.lineTo(116, 0);
//ctx2.lineTo(0, 60);
ctx44.fillStyle = "rgba(255,255,255, 1)";
ctx44.fill();
ctx44.stroke();


/*
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
input.classList.add('styleOption')
input.style.width = 100 %
    formTth[0].appendChild(input);



marka.forEach(el => {
    const option = document.createElement("option");
    // option.classList.add('option')
    option.value = el;
    option.text = el;
    option.classList.add('oform');
    selectList.appendChild(option);

})*/



