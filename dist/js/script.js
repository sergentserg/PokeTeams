shrinkSidenav = () => {
  const shrinkBtn = document.getElementById("shrinkBtn");
  const expandBtn = document.getElementById("expandBtn");
  const pkSidenav = document.getElementById("pkSidenav");
  const mainPage = document.getElementById("main");

  document.querySelectorAll(".side-menu-text").forEach((text) => {
    text.style.display = "none";
  });

  // pkSidenav.style.width = "15vw";
  // mainPage.style.marginLeft = "15vw";
  shrinkBtn.style.display = "none";
  expandBtn.style.display = "inline";
  // document.querySelector("#main").style.backgroundColor = "rgba(0,0,0,0)";
  document.querySelector("#main").style.opacity = "1";
};

openSidenav = () => {
  const shrinkBtn = document.getElementById("shrinkBtn");
  const expandBtn = document.getElementById("expandBtn");
  const pkSidenav = document.getElementById("pkSidenav");
  const mainPage = document.getElementById("main");

  document.querySelectorAll(".side-menu-text").forEach((text) => {
    text.style.display = "inline";
  });

  // pkSidenav.style.width = "40vw";
  // mainPage.style.marginLeft = "40vw";
  shrinkBtn.style.display = "inline";
  expandBtn.style.display = "none";
  // document.querySelector("#main").style.backgroundColor = "rgba(0,0,0,0.1)";
  document.querySelector("#main").style.opacity = "0.2";
};
