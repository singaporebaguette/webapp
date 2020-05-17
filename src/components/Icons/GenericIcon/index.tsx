import React from 'react';

import './style.scss';

export default ({ path, gray = false }: { path: string; gray?: boolean }) => {
  const style: any = {};
  if (gray) {
    style.filter = 'grayscale(1)';
  }

  return <div className="icon" style={{ backgroundImage: `url(${path})`, ...style }} />;
};
