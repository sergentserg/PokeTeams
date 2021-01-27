const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: 'rest_api/config/config.env' });

// Route files
const teams = require('./routes/teams');
const pokemons = require('./routes/pokemons');
const auth = require('./routes/auth');
const users = require('./routes/users');

// Connect to database
connectDB();

const app = express();

// Body paraser; ensures req.body isn't undefined
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/teams', teams);
app.use('/api/v1/pokemons', pokemons);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`.magenta
      .bold
  )
);

// Unhandled Promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process.
  server.close(() => process.exit(1));
});
