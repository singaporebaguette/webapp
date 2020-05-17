import React from 'react';

import Approvness from '../Approvness';
import Rating from '../Rating';
import Price from '../Price';
import Features from '../Features';

import './style.scss';
import { Store } from 'src/data';

type Props = { onClick: Function; store: Store; active?: boolean };

export default ({ onClick, store, active }: Props) => (
  <div
    key={`listing-${store.id}`}
    id={`listing-${store.id}`}
    className={`item ${active ? 'active' : ''}`}
    onClick={() => onClick()}
  >
    <div className="main-content">
      <div className="title-container">
        <h2 className="title">{store.title}</h2>
        <Approvness approved={store.approvedLevel} />
      </div>
      <div style={{ display: 'flex', alignContent: 'center', alignItems: 'baseline' }}>
        <Rating googleRating={store['google-rating']} ownRating={store['internal-rating']} />
        {/*
        <Price price={store.properties.price} />
        */}
      </div>
    </div>
    <Features features={store.features} />
  </div>
);
