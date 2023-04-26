


export function tooltip() {
    // Находим элемент, на который нужно добавить подсказку
    const pl1_card = document.querySelector('.pl1_card');
    const pl2_card = document.querySelector('.pl2_card');
    //console.log(ohlCard)



    // Создаем элемент подсказки
    //  const element = document.querySelector('.element');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Охлаждающая жидкость';


    const tooltip2 = document.createElement('div');
    tooltip2.className = 'tooltip';
    tooltip2.textContent = 'Одометр';
    pl1_card.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        tooltip.style.left = (x + 20) + 'px';
        tooltip.style.top = (y + 20) + 'px';
    });
    pl1_card.addEventListener('mouseover', function (e) {
        //  tooltip.style.top = (e.clientY + 20) + 'px';
        //tooltip.style.left = (e.clientX - 20) + 'px';
        tooltip.style.display = 'block';
        document.body.appendChild(tooltip);
    });

    pl1_card.addEventListener('mouseout', function (e) {
        tooltip.style.display = 'none';
        document.body.removeChild(tooltip);
    });

    pl2_card.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        tooltip2.style.left = (x + 20) + 'px';
        tooltip2.style.top = (y + 20) + 'px';
    });
    pl2_card.addEventListener('mouseover', function (e) {
        //  tooltip.style.top = (e.clientY + 20) + 'px';
        //tooltip.style.left = (e.clientX - 20) + 'px';
        tooltip2.style.display = 'block';
        document.body.appendChild(tooltip2);
    });

    pl2_card.addEventListener('mouseout', function (e) {
        tooltip2.style.display = 'none';
        document.body.removeChild(tooltip2);
    });



}

