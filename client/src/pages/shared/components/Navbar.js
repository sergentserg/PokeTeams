// import pokeball image
import Pokeball from '../assets/Pokeball.png';
import { logout } from '../util/auth';

export function Navbar(isLoggedIn) {
  // Website branding.
  const navBrand = document.createElement('a');
  navBrand.href = isLoggedIn ? 'app.html' : 'index.html';
  navBrand.classList = 'navbar-brand';
  navBrand.innerHTML = `
    <img width="50" height="50" src="${Pokeball}" alt="Pokeball"/>
    PokéTeams
  `;

  // Button for collapsing navigation menu.
  const collapseBtn = document.createElement('button');
  collapseBtn.classList = 'navbar-toggler';
  collapseBtn.setAttribute('data-toggle', 'collapse');
  collapseBtn.setAttribute('data-target', '#navbarNav');
  collapseBtn.innerHTML = `<span class="navbar-toggler-icon"></span>`;

  // Navigation menu.
  const navMenu = document.createElement('ul');
  navMenu.classList = 'navbar-nav ml-auto';
  let links;
  if (!isLoggedIn) {
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.innerHTML = `<i class="fas fa-home"></i> Home`;

    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;

    links = [homeLink, loginLink];
  } else {
    const logoutLink = document.createElement('a');
    logoutLink.addEventListener('click', logout);
    logoutLink.innerHTML = `<i class="fas fa-sign-in-alt"></i> Logout`;
    links = [logoutLink];
  }

  links.forEach((link) => {
    link.classList = 'nav-link';
    const li = document.createElement('li');
    li.classList = 'nav-item';
    li.appendChild(link);
    navMenu.appendChild(li);
  });

  // Narrow content container.
  const container = document.createElement('div');
  container.classList = 'container';
  container.appendChild(navBrand);
  container.appendChild(collapseBtn);
  container.appendChild(navMenu);

  const nav = document.createElement('nav');
  nav.classList = 'navbar navbar-expand-sm navbar-dark bg-danger fixed-top';
  nav.appendChild(container);
  return nav;
}
