


export const map = L.map('map')

console.log('карта')
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
map.setView([59.9386, 30.3141], 7);
//L.marker([59.9386, 30.3141]).addTo(map);
//export const map2 = L.map('map')






/*

// create a map in the "map" div, set the view to a given place and zoom
export var map = L.map('mapid').setView([59.9386, 30.3141], 8);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// add a marker in the given location, attach some popup content to it and open the popup
var greenIcon = L.icon({
    iconUrl: 'images/position.png',

    iconSize: [60, 40], // size of the icon
    iconAnchor: [30, 40], // point of the icon which will correspond to marker's location
});
//L.marker([38.57266152778955, -7.907425130974091], { icon: greenIcon }).addTo(map)

//   .bindPopup('Casa')


// create a map in the "map" div, set the view to a given place and zoom
export var mapcircuit = L.map('mapcircuit').setView([59.9386, 30.3141], 8);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapcircuit);

// add a marker in the given location, attach some popup content to it and open the popup
var greenIcon = L.icon({
    iconUrl: 'images/position.png',

    iconSize: [60, 40], // size of the icon
    iconAnchor: [30, 40], // point of the icon which will correspond to marker's location
});
//L.marker([38.57266152778955, -7.907425130974091], { icon: greenIcon }).addTo(mapcircuit)
 //   .bindPopup('Casa')*/