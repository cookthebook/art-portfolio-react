import React, { Component } from 'react';

import BlogPosts from './blog_posts.json';
import './Blog.scss';

export class Blog extends Component {
  constructor(props) {
    super(props);

    this.getBlogBody = this.getBlogBody.bind(this);
  }

  getBlogBody(bodyElements) {
    var bodySections = [];

    bodyElements.forEach(element => {
      switch (element.type) {
        case "text":
          bodySections.push(
            <p className="BlogPostBody">{element.text}</p>
          );
          break;
        case "embed_html":
            bodySections.push(
              <div className="BlogPostBody" dangerouslySetInnerHTML={{__html: element.html}} />
            )
            break;
        case "image":
          bodySections.push(
            <img src={process.env.PUBLIC_URL + element.src} style={element.style} alt={element.src} />
          )
          break;
        default:
          break;
      }
    })

    return bodySections;
  }

  render() {
    var formatted_posts = [];

    BlogPosts.posts.forEach(post => {
      formatted_posts.push(
        <div style={{ "padding-top": "3em", "padding-bottom": "3em" }}>
          <hr className="PostDivider" />
        </div>
      );

      formatted_posts.push(
        <div className="BlogPost">
          <h1 className="BlogPostTitle">{post.title}</h1>
          <p className="BlogPostDate">{post.date}</p>
          {this.getBlogBody(post.body)}
          {post.author ? <p className="BlogPostBody">{"- " + post.author}</p> : <p className="BlogPostBody">- Aaron</p>}
        </div>
      )
    });

    formatted_posts.reverse();

    return (
      <div className="BlogContainer">
        {formatted_posts}
      </div>
    )
  }
}
