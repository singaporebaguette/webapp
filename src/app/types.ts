import { Store } from 'src/data';
import { Filters, Mode } from 'src/sb';

export type State = {
  markers: any[];
  filteredData: Store[];
  filters: Filters;
  mode: Mode;
  loading: boolean;
  activeStore: string | null;
  title: string | JSX.Element;
};
