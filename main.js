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

const sportsList = document.querySelector('#sports-list');

function rendervenues(doc){
  var layer = new VectorLayer({
    source: new VectorSource({
        features: [
            new Feature({
              geometry: new Point(fromLonLat([doc.data().location._long, doc.data().location._lat])),
              name: 'Somewhere near Nottingham',
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
}

db.collection("venues").limit(3)
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          rendervenues(doc)
        });
    });
