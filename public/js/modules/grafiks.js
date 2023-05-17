

export async function fnTime(t1, t2) {
  const active = Number(document.querySelector('.color').id)
  console.log(t1, t2)
  let timeOld;
  let timeNow;
  if (t1 === undefined && t2 === undefined) {
    const currentDate = new Date();
    timeNow = Math.floor(currentDate.getTime() / 1000);
    const yesterdayDate = new Date();
    yesterdayDate.setHours(yesterdayDate.getHours() - 24);
    timeOld = Math.floor(yesterdayDate.getTime() / 1000);
  }
  else {
    timeOld = t1
    timeNow = t2
  }
  return new Promise(function (resolve, reject) {
    const prms2 = {
      "itemId": active,
      "timeFrom": timeOld,
      "timeTo": timeNow,
      "flags": 1,
      "flagsMask": 1,
      "loadCount": 60000
    }
    const remote2 = wialon.core.Remote.getInstance();
    remote2.remoteCall('messages/load_interval', prms2,
      async function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        console.log(result)
        const global = [];
        const speed = []
        result.messages.forEach(el => {
          const timestamp = el.t;
          const date = new Date(timestamp * 1000);
          const isoString = date.toISOString();
          global.push(isoString)
          speed.push(el.pos.s)
          resolve([global, speed])
        })
      })
  })
}

export async function fnPar(active) {
  console.log('fnpar')
  return new Promise(function (resolve, reject) {
    const prms3 = {
      "source": "",
      "indexFrom": 0,
      "indexTo": 60000,
      "unitId": active,
      "sensorId": 0
    };
    const remote3 = wialon.core.Remote.getInstance();
    remote3.remoteCall('unit/calc_sensors', prms3,
      function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        const sensArr = result;
        resolve(sensArr)
      })
  })
}

export async function fnParMessage(active) {
  return new Promise(function (resolve, reject) {
    const prmss = {
      'id': active,
      'flags': 4096
    }
    const remote11 = wialon.core.Remote.getInstance();
    remote11.remoteCall('core/search_item', prmss,
      async function (code, result) {
        if (code) {
          console.log(wialon.core.Errors.getErrorText(code));
        }
        console.log(result)
        const nameArr = [];
        Object.entries(result.item.sens).forEach(el => {
          nameArr.push([el[1].n, el[1].p])
        })
        resolve(nameArr)
      })
  })
}






