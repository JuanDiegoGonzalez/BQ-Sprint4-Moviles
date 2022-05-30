import './style.css';
import {Map, View, Feature} from 'ol';
import {transform, fromLonLat} from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: transform([-74.0918, 4.64994], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12
  })
});

const venueName = document.getElementById('Vname');
const venueAddress = document.getElementById('Vaddress');
const venueDescription = document.getElementById('Vdescription');
const venueRating = document.getElementById('Vrating');
const venueIndoor = document.getElementById('Vindoor');
let selected = null;
map.on('pointermove', function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    return true;
  });

  if (selected) {
    var information = selected.get('name').split('///')
    venueName.innerHTML = "Name: " + information[0];
    venueAddress.innerHTML = "Address: " + information[1];
    venueDescription.innerHTML = "Description: " + information[2];
    venueRating.innerHTML = "Rating: " + information[3];
    if (information[4] == 'true') {
      venueIndoor.innerHTML = "Indoor";
    }
    else {
      venueIndoor.innerHTML = "Outdoor";
    }
  } else {
    venueName.innerHTML = '&nbsp;';
    venueAddress.innerHTML = '&nbsp;';
    venueDescription.innerHTML = '&nbsp;';
    venueRating.innerHTML = '&nbsp;';
    venueIndoor.innerHTML = '&nbsp;';
  }
});

const sportsList = document.querySelector('#sports-list');
var layersList = []

function rendervenues(doc){
  var layer = new VectorLayer({
    source: new VectorSource({
        features: [
            new Feature({
              geometry: new Point(fromLonLat([doc.data().location._long, doc.data().location._lat])),
              name: doc.data().name + "///" + doc.data().address + "///" + doc.data().description + "///" + doc.data().rating + "///" + doc.data().indoor
            })
        ]
    }),
    style: new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'assets/marker2.png'
      })
    })
  });
  map.addLayer(layer);
  layersList.push(layer);
}

function valueChanged(){
    layersList.forEach(layer => {
        map.removeLayer(layer)
    });
    layersList = []

    var myselect = document.getElementById("sports");
    var sport = myselect.options[myselect.selectedIndex].value;

    var limit = 6
    if (sport.toLowerCase() == 'tennis') {
      limit = 11
    }

    db.collection("venues").where("sport", "==", sport.toLowerCase()).limit(limit)
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          rendervenues(doc)
        });
    });
  }

document.getElementById("sports").addEventListener("change", valueChanged);
