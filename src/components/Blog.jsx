import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = () => {
    updateLikes(blog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div  style={blogStyle}className='blog'>
      <div>
        <li>
        {blog.title} 
        <button className = 'toggler' onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
        </li>
        {blog.author}
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div className='likes'>
            <li>
            likes
            <button onClick={handleLike}>like</button>
            </li>
          </div>
          {blog.likes}
          <div>{blog.user.name}</div>
          {blog.user.username === user.username && (
            <button id = 'remove' onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}



export default Blog