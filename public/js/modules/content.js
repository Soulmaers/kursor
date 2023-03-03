
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


export const tr = `<tr class="tr oneName">
                                                    <td class="td">Дата</td>
                                                    <td class="td">Время</td>
                                                    <td class="td">Колесо</td>
                                                    <td class="td">P, БАР</td>
                                                    <td class="td">t,°C</td>
                                                    <td class="td">Уведомление</td>
                                                </tr>`


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
    else if (el < 10 && el > 5.9) {
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


export function gener(el) {
    let generatedValue;
    if (el === 12) {
        generatedValue = 5;
    }
    if (el >= 8 && el < 12) {
        generatedValue = 4;
    }
    if (el >= 6 && el < 8) {
        generatedValue = 3;
    }
    if (el >= 4 && el < 6) {
        generatedValue = 2;
    }
    if (el < 4) {
        generatedValue = 1;
    }
    return generatedValue;
};


export const objColors = {
    5: "green",
    4: 'green',
    3: 'rgba(273,255,33,0.8)',
    2: 'rgba(255,79,0,0.8)',
    1: 'rgba(176,0,0,1)'
}

export const data = ["BFGoodrich", "Bridgestone", "Continental", "Cordiant", "Dunlop", "Nokian Tyres", "Gislaved", "Goodyear", "Hankook", "Kumho", "Michelin"];