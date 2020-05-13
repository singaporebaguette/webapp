import React from 'react';

import './index.css';

const Rating = ({ mark }: { mark: number} ) => (
  <div className="rating">
    {Math.round(mark) === 0 &&
      <>
        <div className="rating-star empty" />
        <div className="rating-star empty" />
        <div className="rating-star empty" />
        <div className="rating-star empty" />
        <div className="rating-star empty" />
      </>
    }
    {Math.round(mark) === 1 &&
    <>
      <div className="rating-star full" />
      <div className="rating-star empty" />
      <div className="rating-star empty" />
      <div className="rating-star empty" />
      <div className="rating-star empty" />
    </>
    }
    {Math.round(mark) === 2 &&
    <>
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star empty" />
      <div className="rating-star empty" />
      <div className="rating-star empty" />
    </>
    }
    {Math.round(mark) === 3 &&
    <>
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star empty" />
      <div className="rating-star empty" />
    </>
    }
    {Math.round(mark) === 4 &&
    <>
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star empty" />
    </>
    }
    {Math.round(mark) === 5 &&
    <>
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star full" />
      <div className="rating-star full" />
    </>
    }
  </div>
);

export default Rating;
