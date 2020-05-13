import React from 'react';
import './App.css';
import mapboxgl, {GeoJSONSource} from 'mapbox-gl';

import Rating from './components/Rating'
import * as FirebaseService from './services/firebase';

class App extends React.Component<any, { markers: any[]; data: any; }> {
  mapgl: mapboxgl.Map | null;

  constructor(props: any) {
    super(props);

    this.mapgl = null;

    this.state = {
      markers: [],
      data: {
        features: []
      }
    }
  }

  componentDidMount(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzZWxzIiwiYSI6ImNqZHZ5bnBkaTJ6aXAyeHFva3Y3OHFsa2kifQ.xixo5Hr8b1Xr8MxYmWkp2g';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/aksels/cka3ngnee0kr21io7g77hocrr',
      center: [103.809709, 1.364913],
      zoom: 10,
    });

    map.on('load', (e) => {
      /**
       * This is where your '.addLayer()' used to be, instead
       * add only the source without styling a layer
       */
      /*map.addSource('places', {
        type: 'geojson',
        data: bakeries,
      });

      this.addMarkers();*/


      FirebaseService.getStores().onSnapshot((convo) => {
        const res: any = [];
        convo.docs.forEach((doc) => {
          res.push({ id: doc.id, ...doc.data() });
        });

        console.log('res', res)

        const features = res.map((r:any) => {
            return ({
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
                coordinates: [r.coordinates?.lat, r?.coordinates?.lng] as [number, number],
              },
              properties: {
                id: r.id,
                title: r.title,
                description: r.description,
                rate: r.mark,
                approved: r.approved,
                baguettePrice: r.price,
              },
            })
          }
        )

        const data = {
          type: 'FeatureCollection' as const,
          features,
        };

        this.setState({ data })

        if (map.isSourceLoaded('places')) {
          const source = map.getSource('places') as GeoJSONSource;
          source.setData(data);
        } else {
          //map.removeSource('places');
          map.addSource('places', {
            type: 'geojson',
            data,
          });
        }
        this.removeMarkers(() => {
          this.addMarkers(features);
        });
      });
    });

    this.mapgl = map;
  }

  removeMarkers = (cb: Function) => {
    const { markers } = this.state;

    markers.forEach((marker: any) => {
      marker.remove();
    })

    this.setState({ markers: [] }, () => { cb(); })
  }

  addMarkers = (features: any) => {
    /* For each feature in the GeoJSON object above: */
    const markers = features.map((marker: any) => {
      if (!this.mapgl) return;
      /* Create a div element for the marker. */
      var el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = 'marker-' + marker.properties.id;
      /* Assign the `marker` class to each marker for styling. */
      el.className = 'marker';


      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      const m = new mapboxgl.Marker(el, { offset: [0, -32] }).setLngLat(marker.geometry.coordinates).addTo(this.mapgl);

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

      return m;
    });

    this.setState({ markers });
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
    const { data } = this.state;
    console.log('data', data)
    return (
      <>
        <header>
          <div className="logo" />
        </header>
        <div className="sidebar">
          <div className="heading">
            <h1>Approved baguettes</h1>
          </div>
          <div id="listings" className="listings">
            {data.features.map((store: any) => (
              <div
                key={`listing-${store.properties.id}`}
                id={`listing-${store.properties.id}`}
                className="item"
                onClick={() => this.clickStore(store)}
              >
                <a href="#" className="title" id="link-1">
                  {store.properties.title}
                </a>
                <Rating mark={store.properties.rate} />
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
