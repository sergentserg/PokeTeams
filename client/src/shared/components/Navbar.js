import Pokeball from '../assets/Pokeball.png';

export function Navbar(isLoggedIn) {
  // Navbar.
  const nav = document.createElement('nav');
  nav.classList = 'navbar navbar-expand-sm navbar-dark bg-danger';

  let navContent;
  if (!isLoggedIn) {
    nav.classList.add('fixed-top');
    navContent = document.createElement('div');
    navContent.classList = 'container';
    nav.append(navContent);
  } else {
    navContent = nav;
  }

  // Website branding.
  const navBrand = document.createElement('a');
  navBrand.href = isLoggedIn ? 'app.html' : 'index.html';
  navBrand.classList = 'navbar-brand';
  navBrand.innerHTML = `
    <img width="50" height="50" src="${Pokeball}" alt="Pokéball"/>
    PokéTeams
  `;
  navContent.append(navBrand);

  // Button for collapsing navigation menu.
  const collapseBtn = document.createElement('button');
  ``;
  collapseBtn.classList = 'navbar-toggler';
  collapseBtn.setAttribute('data-toggle', 'collapse');
  collapseBtn.setAttribute('data-target', '#navbarNav');
  collapseBtn.innerHTML = `<span class="navbar-toggler-icon"></span>`;
  navContent.append(collapseBtn);

  const collapsedContent = document.createElement('div');
  collapsedContent.classList = 'navbar-collapse collapse';
  collapsedContent.id = 'navbarNav';
  navContent.append(collapsedContent);

  // Navigation menu: (Home + Login) OR (Logout).
  const navMenu = document.createElement('ul');
  navMenu.classList = 'navbar-nav ml-auto';
  let li;
  if (!isLoggedIn) {
    // Home page button.
    li = document.createElement('li');
    li.class = 'nav-item';
    li.innerHTML = `<a href="index.html" class="nav-link"><i class="fas fa-home"></i> Home</a>`;
    navMenu.append(li);

    // Login page button.
    li = document.createElement('li');
    li.class = 'nav-item';
    li.innerHTML = `<a href="auth.html" class="nav-link"><i class="fas fa-sign-in-alt"></i> Login</a>`;
    navMenu.append(li);
  } else {
    // Side nav toggler button.
    nav.classList.add('border-bottom');
    const sideNavToggler = document.createElement('button');
    sideNavToggler.classList = 'btn';
    sideNavToggler.id = 'sidenavToggler';
    sideNavToggler.innerHTML = `<span class="navbar-toggler-icon"></span>`;
    navContent.append(sideNavToggler);
  }
  collapsedContent.append(navMenu);
  return nav;
}
