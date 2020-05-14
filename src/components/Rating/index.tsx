import React from 'react';

import Star from 'src/components/Icons/Star';

const Rating = ({ mark }: { mark: number }) => {
  return (
    <div className="rating">
      {[...Array(Math.round(mark))].map((_, i) => (
        <Star key={i} full />
      ))}
      {[...Array(5 - Math.round(mark))].map((_, i) => (
        <Star key={i} empty />
      ))}
    </div>
  );
};

export default Rating;
