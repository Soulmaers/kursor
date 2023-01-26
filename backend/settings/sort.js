
function allParams(data) {
    const arr1 = Object.values(data);
    // console.log(arr1[5][0].lmsg.p)
    sensors = Object.entries(arr1[5][3].lmsg.p)
    sensor = Object.entries(arr1[5][0].lmsg.p)
}


function lostSens(data) {
    const arr = Object.values(data);
    //console.log(data)
    pressureSensor = [];
    pressureSensor.push(arr[0]); pressureSensor.push(arr[2]); pressureSensor.push(arr[1]); pressureSensor.push(arr[9]);
    pressureSensor.push(arr[8]); pressureSensor.push(arr[7]); pressureSensor.push(arr[6]); pressureSensor.push(arr[3]);
    pressureSensor.push(arr[5]); pressureSensor.push(arr[4]); pressureSensor.push(arr[25]); pressureSensor.push(arr[26]);
    temperatureSensor = [];
    temperatureSensor.push(arr[18]); temperatureSensor.push(arr[17]); temperatureSensor.push(arr[14]); temperatureSensor.push(arr[16]);
    temperatureSensor.push(arr[13]); temperatureSensor.push(arr[15]); temperatureSensor.push(arr[10]); temperatureSensor.push(arr[12]);
    temperatureSensor.push(arr[11]); temperatureSensor.push(arr[19]); temperatureSensor.push(arr[28]); temperatureSensor.push(arr[27]);


}

function geo(data) {
    const arr2 = Object.values(data);
    // console.log(arr2)
    // console.log(arr1[5][0].lmsg.p)
    geoX = arr2[0].pos.x
    geoY = arr2[0].pos.y

    // console.log(geoY, geoX)
}

function geo2(data) {
    const arr2 = Object.values(data);
    // console.log(arr2)
    // console.log(arr1[5][0].lmsg.p)
    geoX2 = arr2[0].pos.x
    geoY2 = arr2[0].pos.y

    //console.log(geoY, geoX)
}




module.exports = {
    lostSens,
    allParams,
    geo,
    geo2




}