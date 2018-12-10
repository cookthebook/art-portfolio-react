import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

export const Sidebar = (props) => {
  var { hideCallback, links } = props;
  return (
    <div className="Sidebar">
      {links}
      <p id="HideButton" className="HideButton" onClick={hideCallback}>{"<"}</p>
    </div>
  );
}
