// https://pokeapi.co/api/v2/pokemon/

// Default spread is pokedex national order
// Grab Sprite - use as bg-image for card
// Grab pokemon typage
// Grab pokemon name

// 0 - 806
// 1 - 807 (for URL)
window.addEventListener("load", (e) => {
  // const allPokemon = {
  //   bulbasaur: 1,
  //   ivysaur: 2,
  // };
  // localStorage.setItem("allPokemon", JSON.stringify(allPokemon));
  // getAsync("https://pokeapi.co/api/v2/pokemon/").then((data) => {
  //   // console.log(data);
  //   data.results.forEach()
  // });
});

async function getAsync(url) {
  const response = await fetch(url);
  return await response.json();
}
