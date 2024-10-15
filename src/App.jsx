import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(sortBlogs(initialBlogs))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage('You\'re in!!!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(sortBlogs([...blogs, createdBlog]))
      setNewBlog({ title: '', author: '', url: '' })
      setErrorMessage(`A new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateLikes = async (blog) => {
    try {
      const updatedBlog = await blogService.update({
        ...blog,
        likes: blog.likes + 1,
      })
      setBlogs(
        sortBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)))
      )
    } catch (error) {
      setErrorMessage('Failed to update likes')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.deletion(blogToDelete.id)
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))
      setErrorMessage(`Blog ${blogToDelete.title} by ${blogToDelete.author} was deleted`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('Failed to delete blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          id='username'

          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          id='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  return (
    <div>
      <h2>Blog Page</h2>

      <h2>log in</h2>
 
      {errorMessage && <div className="error">{errorMessage}</div>}

      {user === null ?
        loginForm() :
        <div>
                <h2>blogs</h2>

          <p>{user.name} logged in</p>
          <Togglable buttonLabel="new blog">
            <BlogForm
              onSubmit={addBlog}
              newBlog={newBlog}
              handleBlogChange={handleBlogChange}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog 
              key={blog.id} 
              blog={blog} 
              updateLikes={updateLikes} 
              deleteBlog={deleteBlog} 
              user={user} 
            />
          )}
        </div>
      }
    </div>
  )
}

export default App