import React from 'react';

import './style.scss';

export default ({ empty, full }: { empty?: boolean; full?: boolean }) => {
  if (empty) {
    return <div className="rating-star empty" />;
  }
  if (full) {
    return <div className="rating-star full" />;
  }
  throw new Error('icon/star wrong usage');
};
