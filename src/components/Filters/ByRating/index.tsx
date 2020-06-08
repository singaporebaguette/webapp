import React from 'react';
import { Filters } from 'src/sb';

import Checkbox from 'src/components/Checkbox';
import Star from 'src/components/Icons/Star';

type Props = { filters: Filters; updateFilter: (key: string, value: any) => void };

const ByRating = ({ filters, updateFilter }: Props) => {
  const update = (rating: number) => () => {
    const filter = [...filters.byRating];

    if (filter.includes(rating)) {
      filter.splice(filter.indexOf(rating), 1);
    } else {
      filter.push(rating);
    }

    updateFilter('byRating', filter);
  };

  const values = [1, 2, 3, 4, 5];

  return (
    <div>
      <div className="dropdown-content-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Rating</div>
        <div className={filters.byRating.length > 0 ? 'visible' : 'invisible'}> ({filters.byRating.length})</div>
      </div>
      <div>
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
            <Checkbox id={`filter-rating-${v}`} checked={filters.byRating.includes(v)} />
            {/*<input className="toggle" type="checkbox" checked={filters.byRating.includes(v)} />*/}
            <div className="rating">
              {[...Array(v)].map((_, i) => (
                <Star key={i} full />
              ))}
              {[...Array(5 - v)].map((_, i) => (
                <Star key={i} empty />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ByRating;
