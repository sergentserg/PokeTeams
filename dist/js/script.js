shrinkSidenav = () => {
  const shrinkBtn = document.querySelector(".shrink-btn");
  const expandBtn = document.querySelector(".expand-btn");
  // const pkSidenav = document.querySelector(".side-nav");
  const sideNavText = document.querySelectorAll(".side-menu-text");
  const mainPage = document.querySelector(".main-content");

  sideNavText.forEach((text) => {
    text.style.display = "none";
  });

  // pkSidenav.style.width = "15vw";
  // mainPage.style.marginLeft = "15vw";
  shrinkBtn.style.display = "none";
  expandBtn.style.display = "inline";
  // mainPage.style.backgroundColor = "rgba(0,0,0,0)";
  mainPage.style.opacity = "1";
};

openSidenav = () => {
  const shrinkBtn = document.querySelector(".shrink-btn");
  const expandBtn = document.querySelector(".expand-btn");
  // const pkSidenav = document.querySelector(".side-nav");
  const sideNavText = document.querySelectorAll(".side-menu-text");
  const mainPage = document.querySelector(".main-content");

  sideNavText.forEach((text) => {
    text.style.display = "inline";
  });

  // pkSidenav.style.width = "40vw";
  // mainPage.style.marginLeft = "40vw";
  shrinkBtn.style.display = "inline";
  expandBtn.style.display = "none";
  // mainPage.style.backgroundColor = "rgba(0,0,0,0.1)";
  mainPage.style.opacity = "0.2";
};
