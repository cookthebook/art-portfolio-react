import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

export const Sidebar = (props) => {
  return (
    <div className="Sidebar">
      {props.links}
    </div>
  );
}
