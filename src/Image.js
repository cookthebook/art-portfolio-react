import React, {Component} from 'react';
import "./Image.css";

export class ImageContainer {
    constructor (src, title) {
        this.src = src;
        this.title = title;
    }
}

export class ImageView extends Component {
    constructor (props) {
        super(props);
        this.src = props.src;
        this.title = props.title;
    }

    render () {
        return (
            <div className="ImageView" onClick={this.props.onClick}>
                <img src={this.src} alt={this.title} className="ImageView-img"></img>
                <p className="ImageView-title">{this.title}</p>
            </div>
        )
    }
}

export class ImagePreview extends Component {
    constructor (props) {
        super(props);
        this.src = props.src;
        this.title = props.title;
    }

    render () {
        return (
            <div className="ImagePreview" onClick={this.props.onClick}>
                <img src={this.src} alt={this.title} className="ImagePreview-img"></img>
                <p>{this.title}</p>
            </div>
        )
    }
}
