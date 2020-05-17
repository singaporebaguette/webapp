import React from 'react';

import Icon from 'src/components/Icons/GenericIcon';

import Approvness from '../Approvness';
import Rating from '../Rating';
import Features from '../Features';

import './style.scss';
import { Feature, Store } from 'src/data';

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
      <div className="item-feature">
        <Icon path="/baguette.svg" size={24} gray={!store.hasBaguette} />
        {store.hasBaguette && <div>sells baguettes</div>}
        {!store.hasBaguette && <div>doesn't have baguette</div>}
      </div>

      {store.features instanceof Array && store.features.includes(Feature.Croissant) && (
        <div className="item-feature" style={{ marginTop: 0 }}>
          <Icon path="/croissant.svg" size={24} />
          <div>can buy a croissant</div>
        </div>
      )}
      {store.features instanceof Array && store.features.includes(Feature.Delivery) && (
        <div className="item-feature" style={{ marginTop: 0 }}>
          <Icon path="/delivery.svg" size={24} />
          <div>delivery available</div>
        </div>
      )}
      {store.features instanceof Array && store.features.includes(Feature.EatIn) && (
        <div className="item-feature" style={{ marginTop: 0 }}>
          <Icon path="/eatin.svg" size={24} />
          <div>can eat in</div>
        </div>
      )}

      {store.link && (
        <div className="item-link">
          <a href={store.link} target="_blank" rel="noreferrer noopener">
            <Icon path="/link.svg" size={32} />
          </a>
        </div>
      )}
    </div>
    <Features features={store.features} />
  </div>
);
