import React from 'react';

import Star from 'src/components/Icons/Star';
import Icon from 'src/components/Icons/GenericIcon';

const Rating = ({ ownRating, googleRating }: { ownRating?: number; googleRating?: number }) => {
  return (
    <div>
      <div>
        {ownRating && ownRating >= 0 && ownRating <= 5 && (
          <div className="rating">
            {[...Array(Math.round(ownRating))].map((_, i) => (
              <Star key={i} full />
            ))}
            {[...Array(5 - Math.round(ownRating))].map((_, i) => (
              <Star key={i} empty />
            ))}
          </div>
        )}
      </div>
      <div>
        {googleRating && googleRating >= 0 && googleRating <= 5 && (
          <div className="rating">
            {[...Array(Math.round(googleRating))].map((_, i) => (
              <Icon key={i} path="/google.svg" />
            ))}
            {[...Array(5 - Math.round(googleRating))].map((_, i) => (
              <Icon key={i} path="/google.svg" gray />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rating;
