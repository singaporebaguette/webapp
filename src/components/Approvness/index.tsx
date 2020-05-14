import React from 'react';

import './index.css';

/*
{ id: 1, name: 'Approved' },
{ id: 2, name: 'Decent' },
{ id: 3, name: 'Emergency Only' },
{ id: 4, name: 'No' },
{ id: 5, name: 'Offense to France' },
*/

const Approvness = ({ approved }: { approved: number }) => (
  <>
    {approved === 1 && <div aria-label="approved!" className="approvness approved" />}
    {approved === 2 && <div className="approvness decent" />}
    {approved === 3 && <div className="approvness emergency" />}
    {approved === 4 && <div className="approvness no " />}
    {approved === 5 && <div className="approvness offense " />}
  </>
);

export default Approvness;
