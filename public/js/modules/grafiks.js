const login = document.querySelectorAll('.log')[1].textContent
export async function fnTime(t1, t2) {
  const active = Number(document.querySelector('.color').id)
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
  return new Promise(async function (resolve, reject) {
    const idw = active
    console.log(idw)
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: (JSON.stringify({ idw, timeOld, timeNow, login }))
    }
    const res = await fetch('/api/loadInterval', param)
    const result = await res.json()
    const noGraf = document.querySelector('.noGraf')
    if (result.count === 0) {
      const preloaderGraf = document.querySelector('.loader') /* находим блок Preloader */
      preloaderGraf.style.opacity = 0;
      noGraf.style.display = 'flex'
    }
    else {
      noGraf.style.display = 'none'
      const global = [];
      const speed = []
      console.log(result)
      result.messages.forEach(el => {
        const timestamp = el.t;
        const date = new Date(timestamp * 1000);
        const isoString = date.toISOString();
        global.push(isoString)
        speed.push(el.pos.s)
        resolve([global, speed])
      })
    }
  })

}

export async function fnPar(active) {
  return new Promise(async function (resolve, reject) {
    const idw = active
    //   console.log(idw)
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: (JSON.stringify({ idw, login }))
    }
    const res = await fetch('/api/sensors', param)
    const sensArr = await res.json()
    console.log(sensArr)
    resolve(sensArr)
  })

}


export async function fnParMessage(active) {
  const idw = active
  return new Promise(async function (resolve, reject) {
    const param = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: (JSON.stringify({ idw, login }))
    }
    const res = await fetch('/api/sensorsName', param)
    const sensArr = await res.json()
    console.log(sensArr)

    const nameArr = [];
    Object.entries(sensArr.item.sens).forEach(el => {
      nameArr.push([el[1].n, el[1].p])
    })
    resolve(nameArr)
  })

}


/*
export async function fnParMessageT(active) {
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
        const nameArr = [];
        Object.entries(result.item.sens).forEach(el => {
          nameArr.push([el[1].n, el[1].p])
        })
        console.log(nameArr)
        resolve(nameArr)
      })
  })
}*/




