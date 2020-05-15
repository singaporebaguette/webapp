import React from 'react';

import Approvness from '../Approvness';
import Rating from '../Rating';
import Price from '../Price';
import Features from '../Features';

import './style.scss';

type Props = { onClick: Function; store: any };

export default ({ onClick, store }: Props) => (
  <div
    key={`listing-${store.properties.id}`}
    id={`listing-${store.properties.id}`}
    className="item"
    onClick={() => onClick()}
  >
    <div className="main-content">
      <div className="title-container">
        <a href="#" className="title" id="link-1">
          <h2>{store.properties.title}</h2>
        </a>
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
