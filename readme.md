# PokeTeams

## Description

Full Stack application which is live at https://poketeams.xyz that allows users to create Pokemon teams. Makes use of the public [PokeAPI](https://pokeapi.co/) for Pokemon data and the [PokeTeams API](https://poketeams.xyz/api/v1) for user accounts and other things.

## PokeTeams API

The PokeTeams API is one that I developed by following for allowing users to have their own accounts. If you wish to fork this, be sure to rename the `config.env.env` file to `config.env` and populate with the values of your choice.

If you're running this in Linux, you must go into `package.json` and change the `start` script from

```
...
"scripts": {
    "start": "SET NODE_ENV=production & node server",
    "dev": "nodemon server"
  },
...
```

to

```
...
"scripts": {
    "start": "NODE_ENV=production node server",
    "dev": "nodemon server"
  },
...
```

Once you've done this, run

```
npm install
```

Issue either of the following commands to run the server:

```
# development mode.
npm run dev

# production mode.
npm run start
```

## PokeTeams frontend

Though this started as a simple app written with vanilla JS, I eventually switched to using babel and webpack to continue to develop this application. Should you decide to clone or fork, keep in mind the following:

```
# webpack.config.js: change mode from "development" to production
mode: "production"

# comment out the following line
// devtool: 'inline-source-map',
```

With that change, within the `client` directory, run the following:

```
# run in development mode
npm run build

# Outputs static files (bundles) to the client/dist folder.
npm run build:prod
```

## Authors and Acknowledgements

- Sergio Garcia (myself)
- Jose Gonzalez
- [Sweet Farm](https://thenounproject.com/sweetfarm/collection/pokemon-go/) for the Pokeball image.
- PEDRO ROMANI RUIZ, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons, for loading GIF image.
- Blank Profile Image by <a href="https://pixabay.com/users/wanderercreative-855399/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=973460">Stephanie Edwards</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=973460">Pixabay</a>

This project started as a simple frontend mockup on figma with [@jm-gonzalez](https://github.com/jm-gonzalez). Together, he and I came up with a simple design that we implemented in Bootstrap. In the time we worked together, we came up with the design, markup, and code for the Pokedex tab, as well as the Moves tab. This wouldn't have been possible without him.

I also want to thank [Brad Traversy](https://github.com/bradtraversy). I followed his tutorial on Udemy to create the nodejs/mongodb backend, where he built the [devcamper API](https://github.com/bradtraversy/devcamper-api). Actually, most of what I know about web development, though not coding in general, can be attributed to watching his videos.

I figured learning about backend development would be easier if I had a project to go along with it, and Brad's tutorial made the process a smooth sailing.

## Disclaimer

This website was made with the intention to learn how to use web technologies, and in no way makes any attempt to profit or claim ownership for any intellectual or creative property found. The data used in this site comes from the which in turn is based on Pokémon, a nintendo trademark.

## License

[MIT](https://choosealicense.com/licenses/mit/)
