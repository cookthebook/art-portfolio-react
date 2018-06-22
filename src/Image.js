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

export const ImageView = (props) => {
    const { image } = props;
    return (
        <div className="ImageView">
            <img src={"/images/fulls/" + image.filename} alt={image.title} className="ImageView-img"></img>
            <p className="ImageView-title">{image.title}</p>
        </div>
    );
}

ImageView.propTypes = {
    image: PropTypes.instanceOf(ImageContainer).isRequired,
};

export const ImagePreview = (props) => {
    const { image } = props;
    return (
        // <div className="ImagePreview">
        //     <img src={"/images/thumbs/" + image.filename} alt={image.title} className="ImagePreview-img"></img>
        //     <p>{image.title}</p>
        // </div>
        <Card className="ImagePreview">
            <CardImg top width="100%" src={"/images/thumbs/" + image.filename} alt={image.title} />
            <CardBody inverse>
                <CardTitle>{image.title}</CardTitle>
            </CardBody>
        </Card>
    );
}

ImagePreview.propTypes = {
    image: PropTypes.instanceOf(ImageContainer).isRequired
};
