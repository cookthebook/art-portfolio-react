import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';

import { GridGallery, FocusGallery } from './Gallery';
import { ImageContainer, VideoContainer } from './Image';
import { Sidebar } from './Sidebar';

import './App.css';

import GalleryData from './gallery_data.json';

class App extends Component {
  get_galleries_from_json () {
    var galleries = [];

    GalleryData.forEach((gallery) => {
      var images = [];

      gallery.sources.forEach((source) => {
        if (source.image != null) {
          images.push({
            image: new ImageContainer(source.image[0], source.image[1]),
            key: source.key
          });
        } else {
          images.push({
            image: new VideoContainer(source.video[0], source.video[1], source.video[2]),
            key: source.key
          });
        }
      });

      galleries.push(
        <GridGallery images={images} title={gallery.title} slideshow={gallery.name} key={gallery.title} />
      );
    });

    return galleries;
  }

  get_routes_from_json (galleries) {
    if (galleries === null) {
      galleries = this.get_galleries_from_json();
    }

    var routes = [];
    GalleryData.forEach((gallery, index) => {
      const TempGallery = ({ match }) => {
        return (
          <div>
            <FocusGallery images={galleries[index].props.images} match={match} />
          </div>
        )
      }
      routes.push(
        <Route exact path={"/gallery/" + gallery.name + "/:key"} component={TempGallery} key={gallery.name} />
      );
    })

    return routes;
  }

  render() {
    var galleries = this.get_galleries_from_json();
    var routes = this.get_routes_from_json(galleries);

    const Home = () => {
      return (
        <div>
          {galleries}
        </div>
      );
    };

    var images_all = [];
    galleries.forEach((gallery) => {
      images_all = images_all.concat(gallery.props.images);
    });
    images_all.sort((element1, element2) => {
      if (parseInt(element1.key, 10) > parseInt(element2.key, 10)) {
        return 1;
      } else if (parseInt(element1.key, 10) < parseInt(element2.key, 10)) {
        return -1;
      } else {
        return 0;
      }
    });
    images_all.reverse();

    console.log(images_all);

    const SlideshowAll = ({ match }) => {
      return (
        <div>
          <FocusGallery images={images_all} match={match} />
        </div>
      );
    };

    var sidebar_links = [
      <Link to="/">Home</Link>,
      <Link to={"/gallery/" + images_all[0].key}>Slideshow</Link>,
    ];

    return (
      <BrowserRouter>
        <div>
          <Sidebar links={sidebar_links}/>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/gallery/:key" component={SlideshowAll} />
              {routes}
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
