Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedBlogUser', JSON.stringify(body))
      cy.visit('')
    })
  })
  
  Cypress.Commands.add('createBlog', ({ title, author, url, likes = 0 }) => {
    cy.request({
      url: `${Cypress.env('BACKEND')}/blogs`,
      method: 'POST',
      body: { title, author, url, likes },
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
      }
    })
    cy.visit('')
  })