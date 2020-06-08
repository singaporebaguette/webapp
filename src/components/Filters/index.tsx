import React from 'react';
import { Filters } from 'src/sb';

import ByBaguette from './ByBaguette';
import ByRating from './ByRating';

type Props = { filters: Filters; updateFilter: (key: string, value: any) => void };

const FiltersC = ({ filters, updateFilter }: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <ul>
      <li className="dropdown">
        <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }} onClick={() => setOpen(!open)}>
          <div className={`filter-arrow ${open ? 'open' : 'closed'}`} />
          Filters
        </div>
        <div className={`dropdown-content ${open ? 'open' : 'closed'}`}>
          <ByBaguette filters={filters} updateFilter={updateFilter} />
          <ByRating filters={filters} updateFilter={updateFilter} />
        </div>
      </li>
    </ul>
  );
};

export default FiltersC;
