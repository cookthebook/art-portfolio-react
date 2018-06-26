import React, { Component } from "react";
import {ImageView, ImagePreview, ImageContainer} from "./Image";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CardDeck, Pagination, PaginationItem, ListGroup, ListGroupItem } from 'reactstrap';

import "./Gallery.css";

export const GridGallery = (props) => {
  const { images } = props;
  const row_width = 4;

  var img_list = [];
  images.forEach((element, index) => {
    img_list.push(
      <Link to={"/gallery/" + props.slideshow + "/" + element.key} className="GridElement" key={index} >
        <ImagePreview image={element.image} />
      </Link>
    );
  });

  var decks = [];
  for (var y = 0; y < img_list.length/row_width; y++) {
    var curr_row = [];
    for (var x = 0; x < row_width; x++) {
      curr_row.push(img_list[y*row_width + x]);
    }
    decks.push(
      <div className="row justify-content-center" key={y.toString()}>
        <CardDeck>
          {curr_row}
        </CardDeck>
      </div>
    );
  }

  return (
    <ListGroup>
      <ListGroupItem className="GridTitle">
        <h3 className="GridTitle">
          {props.slideshow != null ? (
            <Link to={"/gallery/" + props.slideshow + "/0"} className="GridTitle">{props.title}</Link>
          ) : (
            props.title
          )}
        </h3>
      </ListGroupItem>
      <ListGroupItem>
        <div className="Grid">
          {decks}
        </div>
      </ListGroupItem>
    </ListGroup>
  );
}

GridGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.instanceOf(ImageContainer),
    key: PropTypes.string,
  })).isRequired,
  title: PropTypes.string.isRequired,
  slideshow: PropTypes.string,
};

export class FocusGallery extends Component {
  constructor (props) {
    super(props);
    this.images = props.images;

    var index = this.images.findIndex(element => {
      return (element.key === props.match.params.key);
    });

    if (index === -1) {
      index = 0;
    }

    this.state = {
      focus: props.match.params.key,
      index: index,
    }

    this.change_focus = this.change_focus.bind(this);
  }

  change_focus (key) {
    var index = this.images.findIndex(element => {
      return (element.key === key);
    });

    if (index === -1) {
      index = 0;
    }

    this.setState({
      focus: key,
      index: index
    });
  }

  render () {
    return (
      <div className="FocusView">
        <FocusGalleryPagination index={this.state.index} images={this.images} callback={this.change_focus} />
        <ImageView image={this.images[this.state.index].image} />
      </div>
    )
  }
}

FocusGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.instanceOf(ImageContainer),
    key: PropTypes.string,
  })).isRequired
};

const FocusGalleryPagination = (props) => {
  const { index, images, callback } = props;
  var first;

  if (index < 3) {
    first = 0;
  } else if (index > images.length - 3) {
    first = images.length - 5;
  } else {
    first = index - 2;
  }

  var newer_link;
  if (index === 0) {
    newer_link = (
      <PaginationItem disabled>
        <div className="page-link">Newer</div>
      </PaginationItem>
    );
  } else {
    newer_link = (
      <PaginationItem onClick={() => callback(images[index-1].key)}>
        <Link to={images[index-1].key} className="page-link">
          Newer
        </Link>
      </PaginationItem>
    );
  }

  var older_link;
  if (index === (images.length - 1)) {
    older_link = (
      <PaginationItem disabled>
        <div className="page-link">Older</div>
      </PaginationItem>
    );
  } else {
    older_link = (
      <PaginationItem onClick={() => callback(images[index+1].key)}>
        <Link to={images[index+1].key} className="page-link">
          Older
        </Link>
      </PaginationItem>
    );
  }

  return (
    <Pagination className="FocusPagination">
      {newer_link}
      <PaginationItem className={(first === index) ? "disabled" : ""} onClick={() => callback(images[first].key)}>
        <Link to={images[first].key} className="page-link">{first+1}</Link>
      </PaginationItem>
      <PaginationItem className={(first+1 === index) ? "disabled" : ""} onClick={() => callback(images[first+1].key)}>
        <Link to={images[first+1].key} className="page-link">{first+1+1}</Link>
      </PaginationItem>
      <PaginationItem className={(first+2 === index) ? "disabled" : ""} onClick={() => callback(images[first+2].key)}>
        <Link to={images[first+2].key} className="page-link">{first+2+1}</Link>
      </PaginationItem>
      <PaginationItem className={(first+3 === index) ? "disabled" : ""} onClick={() => callback(images[first+3].key)}>
        <Link to={images[first+3].key} className="page-link">{first+3+1}</Link>
      </PaginationItem>
      <PaginationItem className={(first+4 === index) ? "disabled" : ""} onClick={() => callback(images[first+4].key)}>
        <Link to={images[first+4].key} className="page-link">{first+4+1}</Link>
      </PaginationItem>
      {older_link}
    </Pagination>
  )
}

FocusGalleryPagination.propTypes = {
  index: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.instanceOf(ImageContainer),
    key: PropTypes.string,
  })).isRequired,
  callback: PropTypes.func.isRequired,
}
