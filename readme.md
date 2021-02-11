# PokeTeams

## Description

Full Stack application located at https://poketeams.xyz that allows users to create Pokemon teams. Makes use of the public [PokeAPI](https://pokeapi.co/) for Pokemon data and the [PokeTeams API](https://poketeams.xyz/api/v1) for user accounts and other things.

## PokeTeams API

The API for this website is located at https://poketeams.xyz/api/v1. It's a private API that I developed by folowing a tutorial on Udemy, but you can see the documentation there.

If you wish to fork this, be sure to rename the `config.env.env` file to `config.env` and populate with the values of your choice.

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

## Authors and Acknowledgements

- Sergio Garcia
- Jose Gonzalez
- [Sweet Farm](https://thenounproject.com/sweetfarm/collection/pokemon-go/) for the Pokeball image.

This project started as a simple frontend mockup on figma with @jm-gonzalez. Together, he and I came up with a simple design that we implemented in Bootstrap. This wouldn't have been possible without him.

I also want to thank @bradtraversy. I followed his tutorial on Udemy to create the nodejs/mongodb backend, where he built the [devcamper API](https://github.com/bradtraversy/devcamper-api).

I figured learning about backend development would be easier if I had a project to go along with it, and Brad's tutorial made the process a smooth sailing.

## License

[MIT](https://choosealicense.com/licenses/mit/)
