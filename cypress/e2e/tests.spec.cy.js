describe('Visit login page', () => {
  it('Gets, types and asserts', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login')
  })
})

describe('Visit register page', () => {
  it('Gets, types and asserts', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/register')
  })
})

describe('Load register page', () => {
  it('clicking "type" navigates to a new url', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login')
    cy.contains('Register').click()
    cy.url().should('include', '/account/register')
  })
})

describe('Load login page', () => {
  it('clicking "type" navigates to a new url', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/register')
    cy.contains('Login').click()
    cy.url().should('include', '/account/login')
  })
})

describe('Load forgot-password page', () => {
  it('clicking "type" navigates to a new url', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login')
    cy.contains('Forgot password?').click()
    cy.url().should('include', '/account/forgot-password')
  })
})

describe('Change password visibility', () => {
  it('clicking password visibility icon toggles password field type', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login');
    cy.get('#auth-login-password').invoke('attr', 'type')
        .should('eq', 'password');
    cy.get('button[aria-label="toggle password visibility"]').click();
    cy.get('#auth-login-password')
        .should('have.attr', 'type', 'text');
    cy.get('button[aria-label="toggle password visibility"]').click();
    cy.get('#auth-login-password')
        .should('have.attr', 'type', 'password');
  })
})


describe('Check login', () => {
  it('logs in with provided email and password', () => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login');
    cy.get('input#email').type('test1@gmail.com');
    cy.get('input#auth-login-password').type('test456');
    cy.contains('Login').click();
    cy.wait(1000);
    cy.url().should('eq', 'http://localhost:3000/');
  })
})

describe('Logout', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login');
    cy.get('input#email').type('test1@gmail.com');
    cy.get('input#auth-login-password').type('test456');
    cy.contains('Login').click();
    cy.wait(1000);
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('logs out the user', () => {
    cy.contains('Logout').click();
    cy.url().should('eq', 'http://localhost:3000/account/login');
  });
});

describe('Main Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3000/account/login');
    cy.get('input#email').type('test1@gmail.com');
    cy.get('input#auth-login-password').type('test456');
    cy.contains('Login').click();
    cy.wait(1000);
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('displays the correct page title', () => {
    cy.title().should('eq', 'Bookaholic');
  });

  it('displays the matching new friends section', () => {
    cy.contains('Matching new friends').should('exist');
    cy.contains('Start finding friends with similar interests').should('exist');
  });

  it('displays the last inbox list', () => {
    cy.get('[aria-label="last-inbox-list"]').should('exist');
  });
});












