import React from 'react';

import './style.scss';

export default ({ id, onClick, checked }: { id: string; onClick: Function; checked: boolean }) => (
  <div style={{ marginRight: 16 }}>
    <input
      className="cbx"
      type="checkbox"
      id={id}
      style={{ display: 'none' }}
      checked={checked}
      onChange={() => onClick()}
    />
    <label htmlFor={id} className="toggle">
      <span></span>
    </label>
  </div>
);
