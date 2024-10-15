import axios from 'axios'

const baseUrl = '/api/blogs'
let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const update = async (updatedBlog) => {
    try {
      const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
      return response.data
    } catch (error) {
      console.error('Error updating the blog:', error)
      throw error
    }
  }
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
const deletion = async id => {
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config) 
    return response.data 
  }
  
  
export default { getAll, create, setToken, update, deletion, sortBlogs }