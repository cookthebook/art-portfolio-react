import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

export const Sidebar = (props) => {
  var { hideCallback, links } = props;

  var links_formatted = [];
  var divider_key = -1
  links.forEach(link => {
    links_formatted.push(link);
    links_formatted.push(<hr className="SideDivider" key={divider_key} />);
    divider_key = divider_key - 1;
  });

  return (
    <div className="Sidebar">
      {links_formatted}
      <p id="HideButton" className="HideButton" onClick={hideCallback}>{"<"}</p>
    </div>
  );
}
