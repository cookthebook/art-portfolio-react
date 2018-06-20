import React, {Component} from "react";
import {ImageView, ImagePreview} from "./Image.js";

import "./Gallery.css";

export class GridGallery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            images: props.images,
        };
    }

    render () {
        var img_list = [];
        this.state.images.forEach(element => {
            img_list.push(<ImagePreview src={element.src} title={element.title}/>);
        });
        
        return (
            <div className="Grid">
                {img_list}
            </div>
        )
    }
}

export class FocusGallery extends Component {
    constructor (props) {
        super(props);
        this.state = {
            images: props.images,
        };
    }

    unfocus (e) {
        console.log()
    }

    render () {
        return (
            <div></div>
        )
    }
}
