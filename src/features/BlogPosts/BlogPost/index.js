import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

BlogPost.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

function BlogPost({ author, content, title }) {
  return (
    <article className="b-blog-post">
      <h1>{title}</h1>
      <h3 className="b-blog-post__author">By: {author}</h3>
      <p>{content}</p>
    </article>
  );
}

export default BlogPost;
