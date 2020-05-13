import React from 'react';

import './index.css';

const Features = ({ features }: { features: any[]} ) => {
  console.log('features', features)
  if (!(features instanceof Array)) return null;

  return (
    <div className="features">
      {features.includes('delivery') && <div className="feature delivery" /> }
      {features.includes('croissant') && <div className="feature croissant" /> }
      {features.includes('eat-in') && <div className="feature eat-in" /> }
    </div>
  );
}

export default Features;
