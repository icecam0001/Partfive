import React from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ onSubmit, newBlog, handleBlogChange }) => {
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={onSubmit}>
        <div className='formdiv'>
          title:
          <input
            type="text"
            placeholder='write title here'
            value={newBlog.title}
            name="title"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            placeholder='write author here'
            value={newBlog.author}
            name="author"
            onChange={handleBlogChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            placeholder='write url here'
            value={newBlog.url}
            name="url"
            onChange={handleBlogChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  newBlog: PropTypes.object.isRequired,
  handleBlogChange: PropTypes.func.isRequired
}

export default BlogForm