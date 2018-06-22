import React, {Component} from "react";
import {ImageView, ImagePreview, ImageContainer} from "./Image.js";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CardDeck, CardColumns, Card } from 'reactstrap';

import "./Gallery.css";

export const GridGallery = (props) => {
    const { images } = props;
    const row_width = 4;

    var img_list = [];
    images.forEach((element, index) => {
        img_list.push(
            <Link to={"/gallery/" + index.toString()} className="GridElement">
                <ImagePreview image={element.image} key={index} />
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
            <CardDeck key={y.toString()}>
                {curr_row}
            </CardDeck>
        );
    }

    return (
        // <CardColumns className="Grid">
        <div className="Grid">
            {decks}
        </div>
        // </CardColumns>
    );
}

GridGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        image: PropTypes.instanceOf(ImageContainer),
        key: PropTypes.string,
    })).isRequired
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

    get_newer_link () {
        const { index } = this.state;
        var newer_link;
        if (index === 0) {
            newer_link = null;
        } else {
            newer_link = (
                <Link to={"/gallery/" + (index-1).toString()}>
                    <button onClick={() => this.switch_focus(index-1)}>
                        Newer
                    </button>
                </Link>
            )
        }

        return newer_link;
    }

    get_older_link () {
        const { index } = this.state;

        var older_link;

        if (index === this.images.length-1) {
            older_link = null;
        } else {
            older_link = (
                <Link to={"/gallery/" + (index+1).toString()}>
                    <button onClick={() => this.switch_focus(index+1)}>
                        Older
                    </button>
                </Link>
            )
        }
        return older_link;
    }

    render () {
        const { index } = this.state;

        return (
            <div className="FocusView">
                {this.get_newer_link()}
                <ImageView image={this.images[index].image} />
                {this.get_older_link()}
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
