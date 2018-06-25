import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import { GridGallery, FocusGallery } from './Gallery';
import { ImageContainer, VideoContainer } from './Image';
import { Sidebar } from './Sidebar';

import './App.css';

class App extends Component {
  constructor (props) {
  super(props);
  this.images_dig_drawing = [
    { image: new ImageContainer("22.jpg", "Artesynal"), key: "23" },
    { image: new ImageContainer("20.jpg", "Android 21"), key: "22" },
    { image: new VideoContainer("bust_a_move.jpg", "Bust a Move", "bust_a_move.mp4"), key: "21"},
    { image: new VideoContainer("hmmm.jpg", "Hmmm", "hmmm.mp4"), key: "20" },
    { image: new ImageContainer("18.jpg", "Paarthunax"), key: "18" },
    { image: new ImageContainer("17.jpg", "Mononoke"), key: "17" },
    { image: new ImageContainer("16.jpg", "Gator"), key: "16" },
    { image: new ImageContainer("15.jpg", "Mad Max"), key: "15" },
  ];

  this.images_personal = [
    { image: new ImageContainer("24.jpg", "Super Girl"), key:"25" },
    { image: new ImageContainer("21.jpg", "Ace of Hearts"), key: "24" },
    { image: new ImageContainer("19.jpg", "Daniel Bamdad"), key: "19" },
    { image: new ImageContainer("14.jpg", "Bitterblossom"), key: "14" },
    { image: new ImageContainer("13.jpg", "Good Joe"), key: "13" },
    { image: new ImageContainer("12.jpg", "Lunara"), key: "12" },
    { image: new ImageContainer("11.jpg", "Eye"), key: "11" },
    { image: new ImageContainer("10.jpg", "Arya"), key: "10" },
  ];

  this.images_drawing = [
    { image: new ImageContainer("9.jpg", "Self"), key: "9" },
    { image: new ImageContainer("4.jpg", "Wolf"), key: "4" },
    { image: new ImageContainer("3.jpg", "Deer"), key: "3" },
    { image: new ImageContainer("2.jpg", "Hawk"), key: "2" },
    { image: new ImageContainer("1.jpg", "Goat"), key: "1" },
  ];

  this.images_all = this.images_dig_drawing.concat(this.images_personal, this.images_drawing);
  this.images_all.sort((element1, element2) => {
    if (parseInt(element1.key, 10) > parseInt(element2.key, 10)) {
    return 1;
    } else if (parseInt(element1.key, 10) < parseInt(element2.key, 10)) {
    return -1;
    } else {
    return 0;
    }
  });
  this.images_all.reverse();
  }

  render() {
  const Home = () => {
    return (
    <div>
      <GridGallery images={this.images_personal} title="Personal (2016-Present)" />
      <GridGallery images={this.images_dig_drawing} title="UMN Digital Drawing (Spring 2018)" />
      <GridGallery images={this.images_drawing} title="UMN Intro Drawing (Fall 2016)" />
    </div>
    );
  };

  const Gallery = ({ match }) => {
    return (
    <FocusGallery images={this.images_all} match={match} />
    );
  };

  return (
    <BrowserRouter>
    <div>
      <Sidebar />
      <div className="App">
      <Switch>
        <Route exact path={"/"} component={Home} />
        <Route path="/gallery/:key" component={Gallery}/>
      </Switch>
      </div>
    </div>
    </BrowserRouter>
  );
  }
}

export default App;
