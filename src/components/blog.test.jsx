import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
  const blog = {
    title: 'title',
    author: 'Author',
    url: 'http://example.com',
    likes: 1,
    user: {
      username: 'camk',
      name: 'cameron',
    }
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} />)
  
  screen.debug()

  const element = screen.getByText('title')
  expect(element).toBeDefined()

})
test('clicking the button calls event handler once', async () => {
    const blog = {
      title: 'title',
      author: 'Author',
      url: 'http://example.com',
      likes: 1,
      user: {
        username: 'camk',
        name: 'cameron',
      }
    }
  
    const mockHandler = vi.fn()
  
    render(
      <Blog
        blog={blog}
        updateLikes={() => {}}
        deleteBlog={() => {}}
        user={{ username: 'testuser', name: 'Test User' }}
      />
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
  
    expect(screen.getByText('http://example.com')).toBeDefined()
  })

  
  test('likeclicking2x', async () => {
    const blog = {
      title: 'blog',
      author: 'hunter',
      url: 'example.com',
      likes: 10,
      user: {
        username: 'testuser',
        name: 'Test User',
      },
    }
  
    const mockUpdateLikes = vi.fn()
  
    const user = userEvent.setup()
  
    render(
      <Blog
        blog={blog}
        updateLikes={mockUpdateLikes}
        deleteBlog={() => {}}
        user={{ username: 'testuser', name: 'Test User' }}
      />
    )
  
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
  
    const likeButton = screen.getByText('like')
  
    await user.click(likeButton)
    await user.click(likeButton)
  
    expect(mockUpdateLikes.mock.calls).toHaveLength(2)
  })