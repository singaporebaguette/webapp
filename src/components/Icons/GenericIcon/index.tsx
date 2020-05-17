import React from 'react';

import './style.scss';

export default ({
  path,
  gray = false,
  size = 16,
  style: additionalStyle = {},
}: {
  path: string;
  gray?: boolean;
  size?: number;
  style?: object;
}) => {
  const style: any = {};
  if (gray) {
    style.filter = 'grayscale(1)';
  }

  return (
    <div
      className="icon"
      style={{ backgroundImage: `url(${path})`, ...style, height: size, width: size, ...additionalStyle }}
    />
  );
};
