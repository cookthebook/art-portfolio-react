import React, { Component } from 'react';
import logo from './logo.svg';
import {ImageContainer} from './Image';
import {GridGallery} from './Gallery';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      images: new Array(10).fill(
        new ImageContainer("images/Artesyn-Embedded-Technologies-distributor.png", "Artesyn")
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <GridGallery images={this.state.images}/>
      </div>
    );
  }
}

export default App;
