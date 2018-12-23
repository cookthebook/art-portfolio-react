import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Link } from 'react-router-dom';

import { GridGallery, FocusGallery } from './Gallery';
import { ImageContainer, VideoContainer } from './Image';
import { Sidebar } from './Sidebar';
import { Blog } from './Blog';
import { ArtProjects, ArtProjectRoutes } from './ArtProjects';

import './App.css';

import GalleryData from './gallery_data.json';

class App extends Component {
  get_galleries_from_json() {
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

  get_routes_from_json(galleries) {
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
        <Route exact path={"/gallery/" + gallery.name + "/:key"} component={TempGallery} key={gallery.name} className="ViewSwitcher" />
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
      <Link className="SideLink" to="/" key='0'>Home</Link>,
      <Link className="SideLink" to={"/gallery/" + images_all[0].key} key='1'>Slideshow</Link>,
      <Link className="SideLink" to="/blog/" key='2'>Blog</Link>,
      <Link className="SideLink" to='/artprojects/' key='3'>Art Projects</Link>,
      // <Link className="SideLink" to={"/zinefinal/"} key='4'>Comics and Zines Final</Link>
    ];

    var expanded = true;
    var hideSidebar = () => {
      var sidebar = document.getElementsByClassName("Sidebar")[0];
      var app = document.getElementsByClassName("App")[0];
      var hide_button = document.getElementById("HideButton");
      var side_links = document.getElementsByClassName("SideLink");

      if (expanded) {
        sidebar.style.width = "20px";
        app.style.marginLeft = "20px";
        hide_button.innerHTML = ">";

        for (let i = 0; i < side_links.length; i++) {
          side_links.item(i).style.fontSize = "0px";
        }

        expanded = false;
      } else {
        sidebar.style.width = "130px";
        app.style.marginLeft = "130px";
        hide_button.innerHTML = "<";

        for (let i = 0; i < side_links.length; i++) {
          side_links.item(i).style.fontSize = "20px";
        }

        expanded = true;
      }
    }

    const BlogPage = () => {
      return (
        <div>
          <Blog />
        </div>
      )
    }

    const ProjectIndexPage = () => {
      return (
        <div>
          <ArtProjects />
        </div>
      )
    }

    return (
      <BrowserRouter>
        <div>
          <div className="App">
            <Sidebar links={sidebar_links} hideCallback={hideSidebar} />
            <Switch className="ViewSwitcher">
              <Route exact path="/" component={Home} className="ViewSwitcher" />
              <Route exact path="/gallery/:key" component={SlideshowAll} className="ViewSwitcher" />
              <Route exact path="/blog/" component={BlogPage} className="ViewSwitcher" />
              <Route exact path='/artprojects/' component={ProjectIndexPage} className='ViewSwitcher' />
              {routes}
              {ArtProjectRoutes()}
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
