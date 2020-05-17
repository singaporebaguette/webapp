import { BaguetteFilter, Mode } from 'src/sb.d';

export const state = (mode: Mode) => ({
  markers: [],
  filteredData: [],
  filters: {
    byRating: [],
    byBaguette: BaguetteFilter.HasBaguette,
  },
  mode: mode === Mode.Light || mode === Mode.Dark ? mode : Mode.Light,
  loading: true,
  activeStore: null,
});

export const mapPosition = {
  center: [103.75, 1.4] as [number, number],
  zoom: 10,
};

export default {
  state,
  mapPosition,
};
