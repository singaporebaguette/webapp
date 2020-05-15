import React from 'react';

import Approvness from '../Approvness';
import Rating from '../Rating';
import Price from '../Price';
import Features from '../Features';

import './style.scss';

type Props = { onClick: Function; store: any; active?: boolean };

export default ({ onClick, store, active }: Props) => (
  <div
    key={`listing-${store.properties.id}`}
    id={`listing-${store.properties.id}`}
    className={`item ${active ? 'active' : ''}`}
    onClick={() => onClick()}
  >
    <div className="main-content">
      <div className="title-container">
        <h2>{store.properties.title}</h2>
        <Approvness approved={store.properties.approved} />
      </div>
      <div style={{ display: 'flex', alignContent: 'center', alignItems: 'baseline' }}>
        <Rating mark={store.properties.rate} />
        <Price price={store.properties.price} />
      </div>
    </div>
    <Features features={store.properties.features} />
  </div>
);
