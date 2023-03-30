


export async function saveBase(arr) {
    const active = document.querySelector('.color')
    const activePost = active.textContent.replace(/\s+/g, '')
    console.log(activePost)
    arr.unshift(activePost)
    arr.splice(0, 0, arr.splice(1, 1)[0]);
    console.log(arr)
    const complete = await fetch('api/savePr', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arr }),
    })
    const result = await complete.json()
    return console.log(result)
}