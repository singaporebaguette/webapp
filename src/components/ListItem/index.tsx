import React from 'react';

import Icon from 'src/components/Icons/GenericIcon';

import Approvness from '../Approvness';
import Rating from '../Rating';
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
      {store.description && <div className="item-description">{store.description}</div>}
      {store.address && <div className="item-address">{store.address}</div>}
      <div className="item-hasBaguette">
        <Icon path="/marker.svg" size={42} gray={!store.hasBaguette} style={{ backgroundPosition: '-2px -4px' }} />
        {store.hasBaguette && <div>sells baguettes</div>}
        {!store.hasBaguette && <div>doesn't have baguette</div>}
      </div>
    </div>
    <Features features={store.features} />
  </div>
);
