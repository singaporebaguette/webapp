import React from 'react';
import './App.css';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Flipper, Flipped } from 'react-flip-toolkit';

import ListItem from 'src/components/ListItem';
import ListItemLoading from 'src/components/ListItemLoading';

// filters
import ByRating from './components/Filters/ByRating';
import ByPrice from './components/Filters/ByPrice';
import DarkModeSwitch from './components/DarkModeSwitch';

import * as FirebaseService from './services/firebase';
import { Filters, Mode } from './sb.d';

type State = {
  markers: any[];
  data: any;
  filteredData: any;
  filters: Filters;
  mode: Mode;
  loading: boolean;
  activeStore: string | null;
};

const mapDarkStyle = 'mapbox://styles/aksels/cka71ytto0yd41iqugrqnzvb7';
const mapLightStyle = 'mapbox://styles/aksels/cka3ngnee0kr21io7g77hocrr';

class App extends React.Component<any, State> {
  mapgl: mapboxgl.Map | null;

  constructor(props: any) {
    super(props);

    this.mapgl = null;

    const mode: string | null = localStorage.getItem('mode');
    if (mode === Mode.Dark) {
      document.querySelector('html')?.setAttribute('data-theme', 'dark');
    }

    this.state = {
      markers: [],
      data: {
        features: [],
      },
      filteredData: {
        features: [],
      },
      filters: {
        byRating: [],
        byPrice: [],
      },
      mode: mode === Mode.Light || mode === Mode.Dark ? mode : Mode.Light,
      loading: true,
      activeStore: null,
    };
  }

  componentDidMount(): void {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzZWxzIiwiYSI6ImNqZHZ5bnBkaTJ6aXAyeHFva3Y3OHFsa2kifQ.xixo5Hr8b1Xr8MxYmWkp2g';
    const map = new mapboxgl.Map({
      container: 'map',
      style: this.state.mode === Mode.Light ? mapLightStyle : mapDarkStyle,
      center: [103.75, 1.4],
      zoom: 10,
    });

    map.on('load', (e) => {
      FirebaseService.getStores().onSnapshot((convo) => {
        const res: any = [];
        convo.docs.forEach((doc) => {
          res.push({ id: doc.id, ...doc.data() });
        });

        const features = res.map((r: any) => ({
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
            baguettePrice: r.baguettePrice,
            price: r.price,
            features: r.features,
          },
        }));

        const data = {
          type: 'FeatureCollection' as const,
          features,
        };

        this.setState({ data, loading: false }, this.setFilteredData);
      });
    });

    this.mapgl = map;
  }

  setFilteredData = () => {
    console.log('call setFilteredData');
    const { data, filters } = this.state;

    const filtersFunctions: Function[] = [];

    if (filters.byRating.length > 0) {
      filtersFunctions.push((feature: any) => filters.byRating.includes(Math.round(feature.properties.rate)));
    }
    if (filters.byPrice.length > 0) {
      filtersFunctions.push((feature: any) => filters.byPrice.includes(Math.round(feature.properties.price)));
    }

    const features: any = [];
    data.features.forEach((feature: any) => {
      for (const f of filtersFunctions) {
        if (!f(feature)) return;
      }

      features.push(feature);
    });

    const filteredData = {
      features,
    };

    // update internal state
    this.setState({ filteredData });
    if (!this.mapgl) return;

    // update map
    const sourceLoaded = this.mapgl.isSourceLoaded('places');
    if (sourceLoaded === true) {
      const source = this.mapgl.getSource('places') as GeoJSONSource;
      source.setData(data);
    } else if (sourceLoaded === false) {
      this.mapgl.addSource('places', {
        type: 'geojson',
        data,
      });
    }
    this.removeMarkers(() => {
      this.addMarkers(filteredData.features);
    });
  };

  removeMarkers = (cb: Function) => {
    const { markers } = this.state;

    markers.forEach((marker: any) => {
      marker.remove();
    });

    this.setState({ markers: [] }, () => {
      cb();
    });
  };

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
        this.setState({ activeStore: marker.properties.id });
        console.log('marker', marker);
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
      .setHTML('<span></span><span></span><span></span><span></span>')
      .addTo(this.mapgl);
  };

  toggleDarkMode = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.state.mode === Mode.Light) {
      if (this.mapgl) {
        this.mapgl.setStyle(mapDarkStyle);
      }
      this.setState({ mode: Mode.Dark });
      localStorage.setItem('mode', Mode.Dark);

      document.querySelector('html')?.setAttribute('data-theme', 'dark');
      return;
    }

    if (this.state.mode === Mode.Dark) {
      if (this.mapgl) {
        this.mapgl.setStyle(mapLightStyle);
      }
      this.setState({ mode: Mode.Light });
      localStorage.setItem('mode', Mode.Light);

      document.querySelector('html')?.setAttribute('data-theme', 'light');
    }
  };

  clickStore = (store: any) => {
    const activeStore = store.properties.id;
    const filtered = {
      features: [...this.state.filteredData.features],
    };

    let index = -1;
    let f = null;
    for (let i = 0; i < filtered.features.length; i++) {
      const feature = filtered.features[i];
      if (feature.properties.id === activeStore) {
        index = i;
        f = feature;
        break;
      }
    }

    filtered.features.splice(index, 1);
    filtered.features = [f, ...filtered.features];

    this.setState({ activeStore, filteredData: filtered });
    this.flyToStore(store);
    /* Close all other popups and display popup for clicked store */
    this.createPopUp(store);
  };

  updateFilter = (key: string, value: any) => {
    const filters = this.state.filters;

    // @ts-ignore
    filters[key] = value;

    this.setState({ filters }, this.setFilteredData);
  };

  render() {
    const { filters, filteredData: data, loading, activeStore } = this.state;

    console.log('activeStore:', activeStore);
    return (
      <>
        <header>
          <div className="logo" />
        </header>
        <nav className="navbar">
          <ul>
            <ByRating filters={filters} updateFilter={this.updateFilter} />
            <ByPrice filters={filters} updateFilter={this.updateFilter} />
            <li>Approved only</li>
            <li>Delivery</li>
          </ul>
          <ul>
            <li>
              <DarkModeSwitch mode={this.state.mode} onClick={this.toggleDarkMode} />
            </li>
          </ul>
        </nav>
        <div className="sidebar">
          <h1>French approved baguettes.</h1>
          <div id="listings" className="listings">
            {loading && (
              <>
                <ListItemLoading />
                <ListItemLoading />
                <ListItemLoading />
                <ListItemLoading />
                <ListItemLoading />
                <ListItemLoading />
              </>
            )}
            {!loading && data.features.length > 0 && (
              <>
                <Flipper flipKey={data.features.map((f: any) => f.properties.id).join('-')}>
                  {data.features.map((store: any) => (
                    <Flipped key={store.properties.id} flipId={store.properties.id}>
                      <div>
                        <ListItem
                          active={store.properties.id === activeStore}
                          onClick={() => this.clickStore(store)}
                          store={store}
                        />
                      </div>
                    </Flipped>
                  ))}
                </Flipper>
              </>
            )}
          </div>
        </div>
        <div id="map" className="map" />
      </>
    );
  }
}

export default App;
