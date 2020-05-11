import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';

import bakeries from './data/bakeries';

class App extends React.Component {
  mapgl: mapboxgl.Map | null;

  constructor(props: any) {
    super(props);

    this.mapgl = null;
  }

  componentDidMount(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzZWxzIiwiYSI6ImNqZHZ5bnBkaTJ6aXAyeHFva3Y3OHFsa2kifQ.xixo5Hr8b1Xr8MxYmWkp2g';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/aksels/cka2fhxti06ok1iptat6ajj5y',
      center: [103.809709, 1.364913],
      zoom: 10,
    });

    map.on('load', (e) => {
      /**
       * This is where your '.addLayer()' used to be, instead
       * add only the source without styling a layer
       */
      map.addSource('places', {
        type: 'geojson',
        data: bakeries,
      });

      this.addMarkers();
    });

    this.mapgl = map;
  }

  addMarkers = () => {
    /* For each feature in the GeoJSON object above: */
    bakeries.features.forEach((marker) => {
      if (!this.mapgl) return;
      /* Create a div element for the marker. */
      var el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = 'marker-' + marker.properties.id;
      /* Assign the `marker` class to each marker for styling. */
      el.className = 'marker';

      console.log('el', el);

      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      console.log('COORDINATES', marker.geometry.coordinates);
      const m = new mapboxgl.Marker(el, { offset: [0, -32] }).setLngLat(marker.geometry.coordinates).addTo(this.mapgl);
      console.log('m', m);
      /**
       * Listen to the element and when it is clicked, do three things:
       * 1. Fly to the point
       * 2. Close all other popups and display popup for clicked store
       * 3. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      el.addEventListener('click', (e) => {
        /* Fly to the point */
        this.flyToStore(marker);
        /* Close all other popups and display popup for clicked store */
        // createPopUp(marker);
        /* Highlight listing in sidebar */
        var activeItem = document.getElementsByClassName('active');
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        var listing = document.getElementById('listing-' + marker.properties.id);
        if (listing) {
          listing.classList.add('active');
        }
      });
    });
  };

  /**
   * Use Mapbox GL JS's `flyTo` to move the camera smoothly
   * a given center point.
   **/
  flyToStore = (currentFeature: any) => {
    if (this.mapgl) {
      this.mapgl.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15,
      });
    }
  };
  /**
   * Create a Mapbox GL JS `Popup`.
   **/
  createPopUp = (currentFeature: any) => {
    if (!this.mapgl) return;

    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        '<h3>' + currentFeature.properties.title + '</h3>' + '<h4>' + currentFeature.properties.description + '</h4>'
      )
      .addTo(this.mapgl);
  };

  clickStore = (store: any) => {
    this.flyToStore(store);
    /* Close all other popups and display popup for clicked store */
    this.createPopUp(store);
    /* Highlight listing in sidebar */
    var activeItem = document.getElementsByClassName('active');

    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }
    var listing = document.getElementById(store.properties.id);
    if (listing) {
      listing.classList.add('active');
    }
  };

  render() {
    return (
      <>
        <div className="sidebar">
          <div className="heading">
            <h1>Approved baguettes</h1>
          </div>
          <div id="listings" className="listings">
            {bakeries.features.map((store) => (
              <div
                key={`listing-${store.properties.id}`}
                id={`listing-${store.properties.id}`}
                className="item"
                onClick={() => this.clickStore(store)}
              >
                <a href="#" className="title" id="link-1">
                  {store.properties.title}
                </a>
                <div>{store.properties.rate}/5</div>
              </div>
            ))}
          </div>
        </div>
        <div id="map" className="map" />
      </>
    );
  }
}

export default App;
