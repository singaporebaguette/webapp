import React from 'react';

import './index.css';

const Price = ({ price }: { price: number} ) => (
  <div className="price">
    {Math.round(price) === 0 &&
      <>
        <div className="dollar off" />
        <div className="dollar off" />
        <div className="dollar off" />
        <div className="dollar off" />
        <div className="dollar off" />
      </>
    }
    {Math.round(price) === 1 &&
    <>
      <div className="dollar on" />
      <div className="dollar off" />
      <div className="dollar off" />
      <div className="dollar off" />
      <div className="dollar off" />
    </>
    }
    {Math.round(price) === 2 &&
    <>
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar off" />
      <div className="dollar off" />
      <div className="dollar off" />
    </>
    }
    {Math.round(price) === 3 &&
    <>
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar off" />
      <div className="dollar off" />
    </>
    }
    {Math.round(price) === 4 &&
    <>
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar off" />
    </>
    }
    {Math.round(price) === 5 &&
    <>
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar on" />
      <div className="dollar on" />
    </>
    }
  </div>
);

export default Price;
