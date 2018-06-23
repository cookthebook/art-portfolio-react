import React from 'react';
import { Link } from 'react-router-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

export const Sidebar = () => {
  return (
    <div className="Sidebar">
      <Link to="/">Home</Link>
      <Link to="/gallery/0">Slideshow</Link>
    </div>
  )
}
