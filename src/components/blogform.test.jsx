import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './blogform'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'

test('Should call event handler with right details when new blog is created', async () => {
  const mockSubmit = vi.fn()
  const mockHandleChange = vi.fn()
  const mockNewBlog = {
    title: '',
    author: '',
    url: ''
  }
  
  const user = userEvent.setup()

  render(
    <BlogForm
      onSubmit={mockSubmit}
      newBlog={mockNewBlog}
      handleBlogChange={mockHandleChange}
    />
  )

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')
  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'Test Blog Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://testblog.com')
  await user.click(submitButton)

  console.log('mockHandleChange called times:', mockHandleChange.mock.calls.length)
  console.log('mockHandleChange calls:', mockHandleChange.mock.calls)

  expect(mockHandleChange.mock.calls.length).toBeGreaterThanOrEqual(3)
  expect(mockSubmit).toHaveBeenCalledTimes(1)

  const lastThreeCalls = mockHandleChange.mock.calls.slice(-3)
  expect(lastThreeCalls[1][0].target.name).toBe('url')

})