
//    <div class="centerOs" id="1"></div>

export const text = `<div class=" osi">
        <div class="tires_spark">
            <div class="tires mod">
            </div>
            <div class="tires mod">
            </div>
        </div>
            <div class="tires_spark">
            <div class="tires mod">
            </div>
            <div class="tires mod">
            </div>
        </div>
    </div>`


export const twoTyres = ` 
    <div class="frontSpare">
        <div class="tiresProfil spareWill1"></div>
        <div class="tiresProfil spareWill12"></div>
        <div class="imgDivTires"><img class="img" src="./image/kol.png"></div>
           </div>`

export const forTyres = `
<div class="frontSpare sparka">
    <div class="tiresUp">
        <div class="tiresProfil spareWill1_1"></div>
        <div class="tiresProfil spareWill1_2"></div>
    </div>
    <div class="tiresDown">
        <div class="tiresProfil spareWill1_3"></div>
        <div class="tiresProfil spareWill1_4"></div>
    </div>
    <div class="imgDivTires"><img class="img" src="./image/kol.png"></div>
</div>`

export function generDav(el) {
    //  modulAlarm();
    let generatedValue;
    if (el >= 10) {
        generatedValue = 1;
    }
    if (el <= 5.9) {
        generatedValue = 1;
    }
    else {
        generatedValue = 3;
    }
    return generatedValue;
};




export function generFront(el) {
    let generatedValue;
    if (el >= 8 && el <= 10) {
        generatedValue = 3;
        //  console.log('al')
        //  div.style.display = 'none';
    }
    if (el >= 7.5 && el < 8 || el > 10 && el <= 13) {
        generatedValue = 2;
        //  console.log('al')
        //  div.style.display = 'none';
    }
    if (el > -100 && el < 7.5 || el > 13) {
        generatedValue = 1;
        // console.log('noal')
        // alarm()
    }
    return generatedValue;
};

export function generT(el) {
    let generatedValue;
    if (el >= -40 && el <= 35)
        generatedValue = 5;


    return generatedValue;
};
//создаем объект где ключ-результат условия, а свойства - соответсующее условию значение
export const objColor = {
    1: '#e03636',
    2: '#d6d938',
    3: '#3eb051',
    5: '#fff'
}



export const data = ["BFGoodrich", "Bridgestone", "Continental", "Cordiant", "Dunlop", "Nokian Tyres", "Gislaved", "Goodyear", "Hankook", "Kumho", "Michelin"];