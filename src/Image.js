import React from 'react';
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
                <video controls>
                    <source src={"/images/fulls/" + image.videofile} type="video/mp4" />
                </video>
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
