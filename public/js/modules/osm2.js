

export const maps = L.map('maps')

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(maps);
maps.setView([59.9386, 30.3141], 8);
//L.marker([59.9386, 30.3141]).addTo(map);


