import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

export const Sidebar = (props) => {
  var { hideCallback, links } = props;

  var links_formatted = [];
  links.forEach(link => {
    links_formatted.push(link);
    links_formatted.push(<hr className="SideDivider" />);
  });
  links_formatted.pop();

  return (
    <div className="Sidebar">
      {links_formatted}
      <p id="HideButton" className="HideButton" onClick={hideCallback}>{"<"}</p>
    </div>
  );
}
