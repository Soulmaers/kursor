
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
    if (el >= 8 && el <= 9) {
        generatedValue = 3;
        //  console.log('al')
        //  div.style.display = 'none';
    }
    if (el >= 7.5 && el < 8 || el > 9 && el <= 13) {
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
    if (el >= -50 && el <= 35)
        generatedValue = 4;
    if (el > 36)
        generatedValue = 1;

    return generatedValue;
};
//создаем объект где ключ-результат условия, а свойства - соответсующее условию значение
export const objColor = {
    1: '#e03636',
    2: '#9ba805',
    3: '#3eb051',
}