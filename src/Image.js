import React, { Component } from 'react';
import "./Image.css";
import PropTypes from 'prop-types';

import { Card, CardImg, CardBody, CardTitle } from 'reactstrap';


export class ImageContainer {
    constructor (filename, title) {
        this.filename = filename;
        this.title = title;
    }
};

export class VideoContainer extends ImageContainer {
    constructor (filename, title, videofile) {
        super(filename, title);
        this.filename = filename;
        this.title = title;
        this.videofile = videofile;
    }
}

export const ImageView = (props) => {
    const { image } = props;

    return (
        <Card className="ImageView">
            {image.videofile != null ? (
                <CardVideo videofile={image.videofile} />
            ) : (
                <CardImg top src={"/images/fulls/" + image.filename} alt={image.title} className="ImageView-img" />
            )}
            <CardBody inverse="true">
                <CardTitle>{image.title}</CardTitle>
            </CardBody>
        </Card>
    );
}

ImageView.propTypes = {
    image: PropTypes.instanceOf(ImageContainer).isRequired,
};

class CardVideo extends Component {
    constructor (props) {
        super(props);
        this.state = {
            videofile: props.videofile
        };
    }

    render () {
        return (
            <video controls>
                <source src={"/images/fulls/" + this.state.videofile} type="video/mp4" />
            </video>
        )
    }
}

export const ImagePreview = (props) => {
    const { image } = props;
    return (
        <Card className="ImagePreview">
            <CardImg top width="100%" src={"/images/thumbs/" + image.filename} alt={image.title} />
            <CardBody inverse="true">
                <CardTitle>{image.title}</CardTitle>
            </CardBody>
        </Card>
    );
}

ImagePreview.propTypes = {
    image: PropTypes.instanceOf(ImageContainer).isRequired
};
