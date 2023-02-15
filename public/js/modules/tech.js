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






var c2 = document.getElementById("drawLine2");
var ctx2 = c2.getContext("2d");
ctx2.beginPath();
ctx2.lineWidth = "0.01";
ctx2.strokeStyle = "#000";
ctx2.moveTo(0, 60);
ctx2.lineTo(0, 20);
ctx2.lineTo(116, 10);
ctx2.lineTo(116, 60);
ctx2.lineTo(0, 60);
//ctx2.lineTo(0, 60);
ctx2.fillStyle = "rgba(204,85,0, 0.5)";
ctx2.fill();
//ctx2.stroke();

ctx2.beginPath();
ctx2.lineWidth = "0.01";
ctx2.strokeStyle = "#000";
ctx2.moveTo(0, 0);
ctx2.lineTo(0, 50);
ctx2.lineTo(5, 50);
ctx2.lineTo(10, 0);
ctx2.lineTo(0, 0);
//ctx2.lineTo(0, 60);
ctx2.fillStyle = "rgba(255,255,255, 1)";
ctx2.fill();
//ctx2.stroke();

ctx2.beginPath();
ctx2.lineWidth = "0.01";
ctx2.strokeStyle = "#000";
ctx2.moveTo(116, 50);
ctx2.lineTo(111, 50);
ctx2.lineTo(106, 0);
ctx2.lineTo(116, 0);
//ctx2.lineTo(0, 60);
ctx2.fillStyle = "rgba(255,255,255, 1)";
ctx2.fill();
ctx2.stroke();



//lдоп. функционал 3 сегмента
var c3 = document.getElementById("drawLine3");
var ctx3 = c3.getContext("2d");
ctx3.beginPath();
ctx3.lineWidth = "0.01";
ctx3.strokeStyle = "#000";
ctx3.moveTo(0, 10);
ctx3.lineTo(116, 10);
ctx3.lineTo(116, 60);
ctx3.lineTo(0, 60);
ctx3.fillStyle = "rgba(204,85,0, 0.5)";
ctx3.fill();

ctx3.beginPath();
ctx3.lineWidth = "0.01";
ctx3.strokeStyle = "#000";
ctx3.moveTo(0, 0);
ctx3.lineTo(0, 50);
ctx3.lineTo(5, 50);
ctx3.lineTo(10, 0);
ctx3.lineTo(0, 0);
//ctx2.lineTo(0, 60);
ctx3.fillStyle = "rgba(255,255,255, 1)";
ctx3.fill();
//ctx2.stroke();

ctx3.beginPath();
ctx3.lineWidth = "0.01";
ctx3.strokeStyle = "#000";
ctx3.moveTo(116, 50);
ctx3.lineTo(111, 50);
ctx3.lineTo(106, 0);
ctx3.lineTo(116, 0);
//ctx2.lineTo(0, 60);
ctx3.fillStyle = "rgba(255,255,255, 1)";
ctx3.fill();
ctx3.stroke();


var c4 = document.getElementById("drawLine4");
var ctx4 = c4.getContext("2d");
ctx4.beginPath();
ctx4.lineWidth = "0.01";
ctx4.strokeStyle = "#000";
ctx4.moveTo(0, 10);
ctx4.lineTo(116, 30);
ctx4.lineTo(116, 60);
ctx4.lineTo(0, 60);
ctx4.fillStyle = "rgba(204,85,0, 0.5)";
ctx4.fill();

ctx4.beginPath();
ctx4.lineWidth = "0.01";
ctx4.strokeStyle = "#000";
ctx4.moveTo(0, 0);
ctx4.lineTo(0, 50);
ctx4.lineTo(5, 50);
ctx4.lineTo(10, 0);
ctx4.lineTo(0, 0);
//ctx2.lineTo(0, 60);
ctx4.fillStyle = "rgba(255,255,255, 1)";
ctx4.fill();
//ctx2.stroke();

ctx4.beginPath();
ctx4.lineWidth = "0.01";
ctx4.strokeStyle = "#000";
ctx4.moveTo(116, 50);
ctx4.lineTo(111, 50);
ctx4.lineTo(106, 0);
ctx4.lineTo(116, 0);
//ctx2.lineTo(0, 60);
ctx4.fillStyle = "rgba(255,255,255, 1)";
ctx4.fill();
ctx4.stroke();


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



