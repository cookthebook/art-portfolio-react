import React, {Component} from "react";
import {ImageView, ImagePreview, ImageContainer} from "./Image.js";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import "./Gallery.css";

export const GridGallery = (props) => {
    const { images } = props;

    var img_list = [];
    images.forEach((element, index) => {
        img_list.push(
            <div key={index}>
                <Link to={"/gallery/" + index.toString()}>
                    <ImagePreview image={element.image}/>
                </Link>
            </div>
        );
    });

    return (
        <div className="Grid">
            {img_list}
        </div>
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
