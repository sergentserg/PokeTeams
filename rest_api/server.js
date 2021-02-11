const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load environment variables.
dotenv.config({ path: 'rest_api/config/config.env' });
process.env.PROJECT_DIR = __dirname;

// Route files
const teams = require('./routes/teams');
const pokemons = require('./routes/pokemons');
const auth = require('./routes/auth');
const users = require('./routes/users');

// Connect to database.
connectDB();

const app = express();

// ---- Middleware ------
// Body parser; ensures req.body isn't undefined.
app.use(express.json());

// Cookie parser.
app.use(cookieParser());

// Dev logging middleware.
if (process.env.NODE_ENV === 'development') {
  const cors = require('cors');
  app.use(morgan('dev'));
  app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }));
}

// File upload.
app.use(fileupload());

// Sanitize data.
app.use(mongoSanitize());

// Set security headers.
app.use(helmet());

// Prevent XSS attacks.
app.use(xss());

// Rate Limiting.
const limiter = rateLimit({
  windowsMs: process.env.RATE_LIMIT_MINS * 60 * 1000, // in ms
  max: process.env.RATE_LIMIT_MAX,
});

app.use(limiter);

// Prevent http parameter pollution.
app.use(hpp());

// Set static folder.
app.use('/api/v1', express.static(path.join(__dirname, 'public')));

// Mount routers.
app.use('/api/v1/teams', teams);
app.use('/api/v1/pokemons', pokemons);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// Error handling (custom) middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`.magenta
      .bold
  )
);

// Unhandled Promise rejections.
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process.
  server.close(() => process.exit(1));
});
