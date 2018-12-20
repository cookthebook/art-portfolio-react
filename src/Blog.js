import React, { Component } from 'react';

import BlogPosts from './blog_posts.json';
import './Blog.scss';

export class Blog extends Component {
  render() {
    var formatted_posts = [];

    BlogPosts.posts.forEach(post => {
      formatted_posts.push(
        <div className="BlogPost">
          <h1 className="BlogPostTitle">{post.title}</h1>
          <p className="BlogPostDate">{post.date}</p>
          <pre className="BlogPostBody">{post.body}</pre>
        </div>
      )
    })

    return (
      <div className="BlogContainer">
        {formatted_posts}
      </div>
    )
  }
}