import React from 'react';
import './App.css';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Flipped, Flipper } from 'react-flip-toolkit';

import ListItem from 'src/components/ListItem';
import ListItemLoading from 'src/components/ListItemLoading';
// filters
import ByRating from 'src/components/Filters/ByRating';
import ByBaguette from 'src/components/Filters/ByBaguette';
import DarkModeSwitch from 'src/components/DarkModeSwitch';

import rawData, { Store } from 'src/data';
import { storesToMapFeatures } from 'src/services/map';

// types
import { BaguetteFilter, Mode } from 'src/sb.d';
import { State } from './types';

// initialState
import init from './initialState';

// config
import mapboxConfig from 'src/config/mapbox';

class App extends React.Component<any, State> {
  mapgl: mapboxgl.Map | null;

  constructor(props: any) {
    super(props);

    this.mapgl = null;

    const mode: string | null = localStorage.getItem('mode');
    if (mode === Mode.Dark) {
      document.querySelector('html')?.setAttribute('data-theme', 'dark');
    }

    this.state = init.state(mode as Mode);
  }

  componentDidMount(): void {
    mapboxgl.accessToken = mapboxConfig.accessToken;

    const map = new mapboxgl.Map({
      container: 'map',
      style: this.state.mode === Mode.Light ? mapboxConfig.lightStyle : mapboxConfig.darkStyle,
      ...init.mapPosition,
    });

    map.on('load', (e) => {
      this.setState({ loading: false }, this.setFilteredData);
    });

    this.mapgl = map;
  }

  flyInitialState = () => {
    if (!this.mapgl) return;

    this.mapgl.flyTo({
      center: [103.75, 1.4],
      zoom: 10,
    });
  };

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
      let el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = 'marker-' + store.id;
      /* Assign the `marker` class to each marker for styling. */
      if (store.hasBaguette) {
        el.className = 'marker';
      } else {
        el.className = 'marker nobaguette';
      }

      const m = new mapboxgl.Marker(el, { offset: [0, -32] }).setLngLat(store.coordinates).addTo(this.mapgl);

      el.addEventListener('click', (e) => {
        /* Fly to the point */
        this.flyToStore(store);
        this.clickStore(store);
      });

      return m;
    });

    this.setState({ markers });
  };

  flyToStore = (store: Store) => {
    if (this.mapgl) {
      this.mapgl.flyTo({
        center: store.coordinates,
        zoom: 15,
      });
    }
  };

  removePopUp = () => {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();
  };
  createPopUp = (store: Store) => {
    if (!this.mapgl) return;

    this.removePopUp();

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
        this.mapgl.setStyle(mapboxConfig.darkStyle);
      }
      this.setState({ mode: Mode.Dark });
      localStorage.setItem('mode', Mode.Dark);

      document.querySelector('html')?.setAttribute('data-theme', 'dark');
      return;
    }

    if (this.state.mode === Mode.Dark) {
      if (this.mapgl) {
        this.mapgl.setStyle(mapboxConfig.lightStyle);
      }
      this.setState({ mode: Mode.Light });
      localStorage.setItem('mode', Mode.Light);

      document.querySelector('html')?.setAttribute('data-theme', 'light');
    }
  };

  unfocusStore = () => {
    this.removePopUp();
    this.setState({ activeStore: null });
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
    this.flyInitialState();
    this.removePopUp();
    this.unfocusStore();

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
        <div className="logo" onClick={this.flyInitialState} />
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
