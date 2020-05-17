import React from 'react';
import './App.css';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Flipped, Flipper } from 'react-flip-toolkit';

import ListItem from 'src/components/ListItem';
import ListItemLoading from 'src/components/ListItemLoading';
// filters
import ByRating from './components/Filters/ByRating';
import ByBaguette from './components/Filters/ByBaguette';
import DarkModeSwitch from './components/DarkModeSwitch';

import rawData, { Store } from './data';

import { BaguetteFilter, Filters, Mode } from './sb.d';

type State = {
  markers: any[];
  filteredData: Store[];
  filters: Filters;
  mode: Mode;
  loading: boolean;
  activeStore: string | null;
};

const mapDarkStyle = 'mapbox://styles/aksels/cka71ytto0yd41iqugrqnzvb7';
const mapLightStyle = 'mapbox://styles/aksels/cka3ngnee0kr21io7g77hocrr';

const storesToMapFeatures = (stores: Store[]) => {
  const features = stores.map((r) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [r.coordinates?.lat, r?.coordinates?.lng] as [number, number],
    },
    properties: r as any,
  }));

  return features;
};

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
      filteredData: [],
      filters: {
        byRating: [],
        byBaguette: BaguetteFilter.HasBaguette,
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
      this.setState({ loading: false }, this.setFilteredData);
    });

    this.mapgl = map;
  }

  setFilteredData = () => {
    const { filters } = this.state;

    const filtersFunctions: Function[] = [];

    if (filters.byRating.length > 0) {
      filtersFunctions.push((store: Store) => filters.byRating.includes(Math.round(store['google-rating'])));
    }
    if (filters.byBaguette === BaguetteFilter.HasBaguette) {
      filtersFunctions.push((store: Store) => store.hasBaguette);
    }
    if (filters.byBaguette === BaguetteFilter.NoBaguette) {
      filtersFunctions.push((store: Store) => !store.hasBaguette);
    }

    const filteredData: Store[] = [];
    rawData.forEach((feature) => {
      for (const f of filtersFunctions) {
        if (!f(feature)) return;
      }

      filteredData.push(feature);
    });

    // update internal state
    this.setState({ filteredData });
    if (!this.mapgl) return;

    // update map
    const sourceLoaded = this.mapgl.isSourceLoaded('places');
    if (sourceLoaded === true) {
      const source = this.mapgl.getSource('places') as GeoJSONSource;
      // @ts-ignore
      source.setData(storesToMapFeatures(filteredData));
    } else if (sourceLoaded === false) {
      // @ts-ignore
      this.mapgl.addSource('places', storesToMapFeatures(filteredData));
    }
    this.removeMarkers(() => {
      this.addMarkers(filteredData);
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

  addMarkers = (stores: Store[]) => {
    /* For each feature in the GeoJSON object above: */
    const markers = stores.map((store) => {
      if (!this.mapgl) return null;
      /* Create a div element for the marker. */
      var el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = 'marker-' + store.id;
      /* Assign the `marker` class to each marker for styling. */
      if (store.hasBaguette) {
        el.className = 'marker';
      } else {
        el.className = 'marker nobaguette';
      }

      /**
       * Create a marker using the div element
       * defined above and add it to the map.
       **/
      const m = new mapboxgl.Marker(el, { offset: [0, -32] }).setLngLat(store.coordinates).addTo(this.mapgl);

      /**
       * Listen to the element and when it is clicked, do three things:
       * 1. Fly to the point
       * 2. Close all other popups and display popup for clicked store
       * 3. Highlight listing in sidebar (and remove highlight for all other listings)
       **/
      el.addEventListener('click', (e) => {
        /* Fly to the point */
        this.flyToStore(store);
        this.clickStore(store);
      });

      return m;
    });

    this.setState({ markers });
  };

  /**
   * Use Mapbox GL JS's `flyTo` to move the camera smoothly
   * a given center point.
   **/
  flyToStore = (store: Store) => {
    if (this.mapgl) {
      this.mapgl.flyTo({
        center: store.coordinates,
        zoom: 15,
      });
    }
  };
  /**
   * Create a Mapbox GL JS `Popup`.
   **/
  createPopUp = (store: Store) => {
    if (!this.mapgl) return;

    var popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(store.coordinates)
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

  clickStore = (store: Store) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const activeStore = store.id;
    let filtered = [...this.state.filteredData];

    let index = -1;
    let f = null;
    for (let i = 0; i < filtered.length; i++) {
      const feature = filtered[i];
      if (feature.id === activeStore) {
        index = i;
        f = feature;
        break;
      }
    }

    if (f) {
      filtered.splice(index, 1);
      filtered = [f, ...filtered];
    }

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

    const byRating = this.state.filters.byRating;
    const notApprovedOnly =
      (byRating.includes(2) || byRating.includes(1)) &&
      !byRating.includes(3) &&
      !byRating.includes(4) &&
      !byRating.includes(5);

    return (
      <>
        <div className="logo" />
        <nav className="navbar">
          <ul>
            <ByRating filters={filters} updateFilter={this.updateFilter} />
            <ByBaguette filters={filters} updateFilter={this.updateFilter} />
          </ul>
          <ul>
            <li>
              <DarkModeSwitch mode={this.state.mode} onClick={this.toggleDarkMode} />
            </li>
          </ul>
        </nav>
        <div className="sidebar">
          <h1>French {notApprovedOnly ? 'disapproved' : 'approved'} baguettes.</h1>
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
            {!loading && data.length > 0 && (
              <>
                <Flipper flipKey={data.map((f) => f.id).join('-')}>
                  {data.map((store) => (
                    <Flipped key={store.id} flipId={store.id}>
                      <div>
                        <ListItem
                          active={store.id === activeStore}
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
        <div id="overlay" />
        <div id="map" className="map" />
      </>
    );
  }
}

export default App;
