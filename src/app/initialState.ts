import { BaguetteFilter, Mode } from 'src/sb.d';
import { State } from './types';

const title = 'French approved baguettes.';
export const state = (mode: Mode): State => ({
  markers: [],
  filteredData: [],
  filters: {
    byRating: [],
    byBaguette: BaguetteFilter.HasBaguette,
  },
  mode: mode === Mode.Light || mode === Mode.Dark ? mode : Mode.Light,
  loading: true,
  activeStore: null,
  title: title,
});

export const mapPosition = {
  center: [103.75, 1.4] as [number, number],
  zoom: 10,
};

export default {
  state,
  mapPosition,
  title,
};
