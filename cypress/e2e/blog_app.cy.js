describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Cameron Kuperman',
      username: 'user',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user) 
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Blog Page')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })

  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('abcdefg')
    cy.get('#password').type('hijklmnop')
    cy.get('#login-button').click()

    cy.get('.error').should('contain', 'wrong credentials')
  })

  it('user can login', function () {
    cy.login({ username: 'user', password: 'secret' })
  })
})

describe('when logged in', function() {
  beforeEach(function() {
    cy.login({ username: 'user', password: 'secret' })
  })

  it('a new blog can be created', function() {
    cy.contains('new blog').click()
    cy.get('#title').type('cool new blog')
    cy.get('#author').type('Lebron')
    cy.get('#url').type('example.com')
    cy.contains('save').click()
    cy.contains('cool new blog')
  })

  it('user can like a blog', function() {
    cy.createBlog({
      title: 'like demo',
      author: 'author',
      url: 'example.com'
    })
    cy.contains('like demo').parent().as('theBlog')
    cy.get('.toggler').click()
    cy.get('.likes').find('button').click()
    cy.contains('1') 
  })
  it('User can delete blog', function() {
    cy.createBlog({
      title: 'delete demo',
      author: 'author',
      url: 'example.com'
    })
    cy.contains('delete demo').parent().as('theBlog')
    cy.get('.toggler').click()
    cy.get('#remove').click()
    cy.contains('delete demo').should('not.exist')
  })
  it('Only blog creator can see remove function', function() {
    cy.createBlog({
      title: 'vision demo',
      author: 'author',
      url: 'example.com'
    })
    cy.contains('vision demo')
    cy.get('.toggler').click()
    cy.get('remove').should('exist')
  
    const anotherUser = {
      name: 'user2',
      username: 'user2',
      password: 'secret',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
    cy.login({ username: anotherUser.username, password: anotherUser.password })
    cy.contains('vision demo')
    cy.get('.toggler').click()
    cy.get('remove').should('not.exist')
  })

  it('Blogs are in descending order according to likes', function() {
    const blogs = [
      {
        title: 'Title1',
        author: 'Author1',
        url: 'example.com',
        likes: 2
      },
      {
        title: 'Title2',
        author: 'Author2',
        url: 'example.com',
        likes: 1
      },
      {
        title: 'Title3',
        author: 'Author3',
        url: 'example.com',
        likes: 3
      }
    ]
    
    blogs.forEach(blog => cy.createBlog(blog))
  
    cy.get('.blog').eq(0).should('contain', 'Title3')
    cy.get('.blog').eq(1).should('contain', 'Title1')
    cy.get('.blog').eq(2).should('contain', 'Title2')
  
    // Test reordering after likes
    cy.get('.blog').eq(1).find('.toggler').click()
    cy.get('.blog').eq(1).find('.likes').find('button').click()
    cy.wait(500) // Wait for update
    cy.get('.blog').eq(1).find('.likes').find('button').click()
    cy.wait(500) // Wait for update
  
    cy.get('.blog').eq(0).should('contain', 'Title1')
    cy.get('.blog').eq(1).should('contain', 'Title3')
    cy.get('.blog').eq(2).should('contain', 'Title2')
  })
})

