import React from 'react';
import useSound from 'use-sound';

import './style.scss';

import { Mode } from 'src/sb.d';

const switchOnSound = require('./switch-on.mp3');
const switchOffSound = require('./switch-off.mp3');

export default ({ mode, onClick }: { mode: Mode; onClick: Function }) => {
  const [playOn] = useSound(switchOnSound);
  const [playOff] = useSound(switchOffSound);

  return (
    <div
      className="toggleWrapper"
      onClick={(e) => {
        if (mode === Mode.Dark) {
          playOn();
        } else {
          playOff();
        }
        onClick(e);
      }}
    >
      <input type="checkbox" className="dn" id="dn" checked={mode === Mode.Dark} readOnly />
      <label htmlFor="dn" className="toggle">
        <span className="toggle__handler">
          <span className="crater crater--1"></span>
          <span className="crater crater--2"></span>
          <span className="crater crater--3"></span>
        </span>
        <span className="star star--1"></span>
        <span className="star star--2"></span>
        <span className="star star--3"></span>
        <span className="star star--4"></span>
        <span className="star star--5"></span>
        <span className="star star--6"></span>
      </label>
    </div>
  );
};
