import React from 'react';
import { Filters } from 'src/sb';

import Checkbox from 'src/components/Checkbox';
type Props = { filters: Filters; updateFilter: (key: string, value: any) => void };

const ByPrice = ({ filters, updateFilter }: Props) => {
  const update = (rating: number) => () => {
    const filter = [...filters.byPrice];

    if (filter.includes(rating)) {
      filter.splice(filter.indexOf(rating), 1);
    } else {
      filter.push(rating);
    }

    updateFilter('byPrice', filter);
  };

  const values = [1, 2, 3, 4];

  return (
    <li className="dropdown">
      <span>
        Price <span className={filters.byPrice.length > 0 ? 'visible' : 'invisible'}>({filters.byPrice.length})</span>
      </span>
      <div className="dropdown-content">
        {values.map((v) => (
          <div
            key={v}
            className="dropdown-content-item"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              update(v)();
            }}
          >
            <Checkbox id={`filter-rating-${v}`} checked={filters.byPrice.includes(v)} />
            <div className="rating">{[...Array(v)].map((_, i) => '$')}</div>
          </div>
        ))}
      </div>
    </li>
  );
};

export default ByPrice;
