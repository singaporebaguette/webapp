import React from 'react';
import { BaguetteFilter, Filters } from 'src/sb.d';

import Checkbox from 'src/components/Checkbox';

type Props = { filters: Filters; updateFilter: (key: string, value: any) => void };

const ByBaguette = ({ filters, updateFilter }: Props) => {
  const update = () => {
    updateFilter(
      'byBaguette',
      filters.byBaguette === BaguetteFilter.HasBaguette ? BaguetteFilter.Both : BaguetteFilter.HasBaguette
    );
  };

  return (
    <div>
      <div
        className="dropdown-content-item"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          update();
        }}
      >
        <Checkbox id="filter-hasBaguette" checked={filters.byBaguette === BaguetteFilter.HasBaguette} />
        <div>Sells baguettes</div>
      </div>
    </div>
  );
};

export default ByBaguette;
