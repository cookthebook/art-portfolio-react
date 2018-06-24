import React, {Component} from "react";
import {ImageView, ImagePreview, ImageContainer} from "./Image.js";
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
            <Link to={"/gallery/" + index.toString()} className="GridElement" key={index} >
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
        this.state = {
            index: parseInt(props.match.params.index, 10),
        };
        this.switch_focus = this.switch_focus.bind(this);
    }

    switch_focus (index) {
        this.setState({
            index: index
        });
    }

    get_pagination () {
        var first;

        if (this.state.index < 3) {
            first = 0;
        } else if (this.state.index > this.images.length - 3) {
            first = this.images.length - 5;
        } else {
            first = this.state.index - 2;
        }

        var newer_link;
        if (this.state.index === 0) {
            newer_link = (
                <PaginationItem disabled>
                    <div className="page-link">Newer</div>
                </PaginationItem>
            );
        } else {
            newer_link = (
                <PaginationItem>
                    <Link to={"/gallery/" + (this.state.index-1).toString()} className="page-link" onClick={() => this.switch_focus(this.state.index-1)}>
                        Newer
                    </Link>
                </PaginationItem>
            );
        }

        var older_link;
        if (this.state.index === (this.images.length - 1)) {
            older_link = (
                <PaginationItem disabled>
                    <div className="page-link">Older</div>
                </PaginationItem>
            );
        } else {
            older_link = (
                <PaginationItem>
                    <Link to={"/gallery/" + (this.state.index+1).toString()} className="page-link" onClick={() => this.switch_focus(this.state.index+1)}>
                        Older
                    </Link>
                </PaginationItem>
            );
        }

        return (
            <Pagination className="FocusPagination">
                {newer_link}
                <PaginationItem onClick={() => this.switch_focus(first)} className={(first === this.state.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + first.toString()} className="page-link">{first}</Link>
                </PaginationItem>
                <PaginationItem onClick={() => this.switch_focus(first+1)} className={(first+1 === this.state.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + (first+1).toString()} className="page-link">{first+1}</Link>
                </PaginationItem>
                <PaginationItem onClick={() => this.switch_focus(first+2)} className={(first+2 === this.state.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + (first+2).toString()} className="page-link">{first+2}</Link>
                </PaginationItem>
                <PaginationItem onClick={() => this.switch_focus(first+3)} className={(first+3 === this.state.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + (first+3).toString()} className="page-link">{first+3}</Link>
                </PaginationItem>
                <PaginationItem onClick={() => this.switch_focus(first+4)} className={(first+4 === this.state.index) ? "disabled" : ""}>
                    <Link to={"/gallery/" + (first+4).toString()} className="page-link">{first+4}</Link>
                </PaginationItem>
                {older_link}
            </Pagination>
        )
    }

    render () {
        const { index } = this.state;

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
