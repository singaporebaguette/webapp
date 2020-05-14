import React from 'react';

import './index.css';

const Price = ({ price }: { price: number }) => <div className="price">{'$'.repeat(Math.round(price))}</div>;

export default Price;
