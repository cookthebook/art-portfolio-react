import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import { GridGallery, FocusGallery } from './Gallery';
import { ImageContainer } from './Image';
import { Sidebar } from './Sidebar';

import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.images_dig_drawing = [
      { image: new ImageContainer("22.jpg", "Artesynal"), key: "0" },
      { image: new ImageContainer("20.jpg", "Android 21"), key: "2" },
      { image: new ImageContainer("18.jpg", "Paarthunax"), key: "4" },
      { image: new ImageContainer("17.jpg", "Mononoke"), key: "5" },
      { image: new ImageContainer("16.jpg", "Gator"), key: "6" },
      { image: new ImageContainer("15.jpg", "Mad Max"), key: "7" },
    ];

    this.images_personal = [
      { image: new ImageContainer("21.jpg", "Ace of Hearts"), key: "1" },
      { image: new ImageContainer("19.jpg", "Daniel Bamdad"), key: "3" },
      { image: new ImageContainer("14.jpg", "Bitterblossom"), key: "8" },
      { image: new ImageContainer("13.jpg", "Good Joe"), key: "9" },
      { image: new ImageContainer("12.jpg", "Lunara"), key: "10" },
      { image: new ImageContainer("11.jpg", "Eye"), key: "11" },
      { image: new ImageContainer("10.jpg", "Arya"), key: "12" },
    ];

    this.images_drawing = [
      { image: new ImageContainer("9.jpg", "Self"), key: "13" },
      { image: new ImageContainer("4.jpg", "Wolf"), key: "14" },
      { image: new ImageContainer("3.jpg", "Deer"), key: "15" },
      { image: new ImageContainer("2.jpg", "Hawk"), key: "16" },
      { image: new ImageContainer("1.jpg", "Goat"), key: "17" },
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

    this.state = {
      focus: null
    }
    this.set_focus = this.set_focus.bind(this);
  }

  set_focus (focus) {
    console.log("Setting default focus:");
    console.log(focus);
    this.setState({
      focus: focus
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Sidebar />
          <div className="App">
            <Route exact path={"/(gallery|)"} render={() => (
              <div>
                <GridGallery images={this.images_dig_drawing} title="UMN Digital Drawing (Spring 2018)" />
                <GridGallery images={this.images_personal} title="Personal (2016-Present)" />
                <GridGallery images={this.images_drawing} title="UMN Intro Drawing (Fall 2016)" />
              </div>
            )}/>
            <Route path="/gallery/:index" render={(props) => <FocusGallery images={this.images_all} {...props} />}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
