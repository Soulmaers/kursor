import { objColors, gener } from '../../content.js'


const drawLine = (canvas, yStart, yEnd, num, wid, color) => {
    const ctx = canvas.getContext("2d");
    const width = (wid / num) + 1
    const height = 60 / num;

    canvas.width = width;
    canvas.height = height;

    // Рисуем заливку
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 10);
    ctx.lineTo(5, height - 10);
    ctx.lineTo(7.5, yStart);
    ctx.lineTo(width - 7.5, yEnd);
    ctx.lineTo(width - 5, height - 10);
    ctx.lineTo(width, height - 10);
    ctx.lineTo(width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath();

    // Рисуем обводку треугольных частей
    // Левая часть
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height - 10);
    ctx.lineTo(5, height - 10);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Правая часть
    ctx.beginPath();
    ctx.moveTo(width, height - 10);
    ctx.lineTo(width - 5, height - 10);
    ctx.lineTo(width - 10, 0);
    ctx.lineTo(width, 0);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
};


export function protekGrafTwo(y1, y2, containerCard, persent, num) {
    const color = objColors[gener(persent)];
    drawLine(containerCard[0].querySelector("#drawLine2"), y1 / num, y2 / num, num, 348, color);
}

export function protekGrafThree(y1, y2, y3, containerCard, persent, num) {
    const color = objColors[gener(persent)];
    drawLine(containerCard[0].querySelector("#drawLine2"), y1 / num, y2 / num, num, 174, color);
    drawLine(containerCard[1].querySelector("#drawLine3"), y2 / num, y3 / num, num, 174, color);
}

export function protekGrafFour(y1, y2, y3, y4, containerCard, persent, num) {
    const color = objColors[gener(Number(persent))];
    drawLine(containerCard[0].querySelector("#drawLine2"), y1 / num, y2 / num, num, 116, color);
    drawLine(containerCard[1].querySelector("#drawLine3"), y2 / num, y3 / num, num, 116, color);
    drawLine(containerCard[2].querySelector("#drawLine4"), y3 / num, y4 / num, num, 116, color);
}





export function protekGrafFree(containerCard, persent, num) {
    const drawLine = (canvas, num, wid) => {
        const ctx = canvas.getContext("2d");
        const width = wid / num;
        const height = 60 / num;

        canvas.width = width;
        canvas.height = height;

        // Рисуем заливку
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, height - 10);
        ctx.lineTo(5, height - 10);
        ctx.lineTo(10, 0);
        ctx.lineTo(width - 10, 0);
        ctx.lineTo(width - 5, height - 10);
        ctx.lineTo(width, height - 10);
        ctx.lineTo(width, height);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.closePath();


        // Рисуем обводку треугольных частей
        // Левая часть
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height - 10);
        ctx.lineTo(5, height - 10);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();


        // Правая часть
        ctx.beginPath();
        ctx.moveTo(width, height - 10);
        ctx.lineTo(width - 5, height - 10);
        ctx.lineTo(width - 10, 0);
        ctx.lineTo(width, 0);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
    };

    drawLine(containerCard[0].querySelector("#drawLine2"), num, 116);
    drawLine(containerCard[1].querySelector("#drawLine3"), num, 116);
    drawLine(containerCard[2].querySelector("#drawLine4"), num, 116);
}


