import React from 'react';

import './style.scss';

export default ({ id, checked }: { id: string; checked: boolean }) => (
  <div style={{ marginRight: 16 }}>
    <input className="cbx" type="checkbox" id={id} style={{ display: 'none' }} checked={checked} onChange={() => {}} />
    <label htmlFor={id} className="toggle">
      <span></span>
    </label>
  </div>
);
