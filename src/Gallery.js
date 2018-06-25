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
            <Link to={"/gallery/" + element.key} className="GridElement" key={index} >
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
            <ListGroupItem className="GridTitle"><h3 className="GridTitle">{props.title}</h3></ListGroupItem>
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
    title: PropTypes.string.isRequired
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

        this.focus = props.match.params.key;
        this.index = index;

        console.log("New focus:");
        console.log(this);
    }

    get_pagination () {
        var first;

        if (this.index < 3) {
            first = 0;
        } else if (this.index > this.images.length - 3) {
            first = this.images.length - 5;
        } else {
            first = this.index - 2;
        }

        var newer_link;
        if (this.index === 0) {
            newer_link = (
                <PaginationItem disabled>
                    <div className="page-link">Newer</div>
                </PaginationItem>
            );
        } else {
            newer_link = (
                <PaginationItem>
                    <Link to={"/gallery/" + this.images[this.index-1].key} className="page-link">
                        Newer
                    </Link>
                </PaginationItem>
            );
        }

        var older_link;
        if (this.index === (this.images.length - 1)) {
            older_link = (
                <PaginationItem disabled>
                    <div className="page-link">Older</div>
                </PaginationItem>
            );
        } else {
            older_link = (
                <PaginationItem>
                    <Link to={"/gallery/" + this.images[this.index+1].key} className="page-link">
                        Older
                    </Link>
                </PaginationItem>
            );
        }

        return (
            <Pagination className="FocusPagination">
                {newer_link}
                <PaginationItem className={(first === this.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + this.images[first].key} className="page-link">{first}</Link>
                </PaginationItem>
                <PaginationItem className={(first+1 === this.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + this.images[first+1].key} className="page-link">{first+1}</Link>
                </PaginationItem>
                <PaginationItem className={(first+2 === this.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + this.images[first+2].key} className="page-link">{first+2}</Link>
                </PaginationItem>
                <PaginationItem className={(first+3 === this.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + this.images[first+3].key} className="page-link">{first+3}</Link>
                </PaginationItem>
                <PaginationItem className={(first+4 === this.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + this.images[first+4].key} className="page-link">{first+4}</Link>
                </PaginationItem>
                {older_link}
            </Pagination>
        )
    }

    render () {
        const index = this.index;

        return (
            <div className="FocusView">
                {this.get_pagination()}
                <ImageView image={this.images[index].image} />
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
