const databaseService = require('./services/database.service');
exports.createDate = () => {
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    today = day + '.' + month + '.' + year;
    let time = new Date();
    const hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    time = hour + ':' + minutes
    const todays = today + ' ' + time
    return [todays]

}

exports.convert = (ob) => {
    const uniq = new Set(ob.map(e => JSON.stringify(e)));
    return Array.from(uniq).map(e => JSON.parse(e));
}


exports.processing=async (arr, timez, idw, geoLoc, group, name, start)=>{
 const newdata=arr[0]
     let mess;
    const res=await  databaseService.dostupObject(idw)
         const event=newdata.event
    if (event === 'Заправка') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, litrazh: `${start}`, time: `Время заправки: ${newdata.time}` }]
    }
    if (event === 'Простой') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, time: `${newdata.time}`, alarm: `${newdata.alarm}` }]
    }
    if (event === 'Предупреждение') {
        mess = [{ event: event, name: `${name}`, time: `${newdata.time}`, tyres: `${newdata.tyres}`, param: `${newdata.param}`, alarm: `${newdata.alarm}` }]
    }
    if (event === 'Слив') {
        mess = [{ event: event, group: `Компания: ${group}`, name: `${name}`, litrazh: `${start}`, time: `Время слива: ${newdata.time}` }]
    }
    return {msg:mess, logins:res}
}
