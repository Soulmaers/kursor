
//    <div class="centerOs" id="1"></div>




export const formUpdate = `<div class="form-group">
<label>Логин</label>
<input type="text" class="form-control" name="username">
</div>
<div class="form-group">
<label>Пароль</label>
<input type="password" class="form-control" name="password">
</div>
<div class="form-group">
<label>Права доступа</label>
<select class="sel" id="select">
    <option class="opt" selected disabled>Укажите права доступа</option>
    <option class="opt" value="Пользователь" name="role">Пользователь</option>
    <option class="opt" value="Администратор" name="role">Администратор</option>
</select>
</div>
<div class="btnWrap">
<button class="btn-warning btn-lg">Добавить</button>
</div>`

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


export const tr = `<h3 class="tr oneName">
                                                    <p class="td">Дата</p>
                                               
                                                      <p class="td">Колесо</p>
                                                    <p class="td">P, бар</p>
                                                    <p class="td">t,°C</p>
                                                    <p class="td">Уведомления</p>
                                                </h3>`


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

export function generDav(el, arrBar) {
    console.log(el, arrBar)


    let generatedValue;
    if (el >= Number(arrBar.dnmin) && el <= Number(arrBar.dnmax)) {
        console.log('1')
        generatedValue = 3;
    }
    if (el > Number(arrBar.knd) && el <= Number(arrBar.dnn) || el > Number(arrBar.dvn) && el <= Number(arrBar.kvd)) {
        console.log('2')
        generatedValue = 2;
    }
    if (el <= Number(arrBar.knd) || el >= Number(arrBar.kvd)) {
        console.log('3')
        generatedValue = 1;
    }
    console.log(generatedValue)
    return generatedValue;
};

export function generDavKran(el) {
    let generatedValue;
    if (el >= 6 && el <= 10) {
        generatedValue = 3;
        //  console.log('al')
        //  div.style.display = 'none';
    }
    else {
        generatedValue = 1;
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
    1: '#FF0000',
    2: '#FFFF00',
    3: '#4af72f',//#009933',
    5: '#fff'
}
export const objColorFront = {
    1: '#FF0000',
    2: '#FFFF00',
    3: '#009933',//#009933',
    5: '#fff'
}

export function gener(el) {
    let generatedValue;
    if (el === 100) {
        generatedValue = 5;
    }
    if (el >= 80 && el < 100) {
        generatedValue = 4;
    }
    if (el >= 60 && el < 80) {
        generatedValue = 3;
    }
    if (el >= 40 && el < 60) {
        generatedValue = 2;
    }
    if (el < 40) {
        generatedValue = 1;
    }
    return generatedValue;
};


export const objColors = {
    5: '#009933',//зеленый
    4: '#009933', //зеленый
    3: '#FFFF00',//желтый
    2: '#FF6633',//оранж
    1: '#FF0000'//красный
}

export const data = ["BFGoodrich", "Bridgestone", "Continental", "Cordiant", "Dunlop", "Nokian Tyres", "Gislaved", "Goodyear", "Hankook", "Kumho", "Michelin"];
export const dataIdTyres = ['01id', '02id', '03id', '04id'];