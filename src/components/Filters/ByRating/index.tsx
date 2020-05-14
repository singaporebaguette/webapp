import React from 'react';
import { Filters } from 'src/sb';

import Checkbox from 'src/components/Checkbox';
import Star from 'src/components/Icons/Star';

type Props = { filters: Filters; updateFilter: (key: string, value: any) => void };

const ByRating = ({ filters, updateFilter }: Props) => {
  const update = (rating: number) => () => {
    console.log('update', rating);
    const filter = [...filters.byRating];
    console.log('in', filter);

    if (filter.includes(rating)) {
      filter.splice(filter.indexOf(rating), 1);
    } else {
      filter.push(rating);
    }

    console.log('UPDATE FILTER', filter);
    updateFilter('byRating', filter);
  };

  const values = [1, 2, 3, 4, 5];

  return (
    <li className="dropdown">
      <span>
        Rating{' '}
        <span className={filters.byRating.length > 0 ? 'visible' : 'invisible'}>({filters.byRating.length})</span>
      </span>
      <div className="dropdown-content">
        {values.map((v) => (
          <div key={v} className="dropdown-content-item">
            <Checkbox id={`filter-rating-${v}`} onClick={update(v)} checked={filters.byRating.includes(v)} />
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
    </li>
  );
};

export default ByRating;
