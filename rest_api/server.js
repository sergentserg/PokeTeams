const express = require('express');
const dotenv = require('dotenv');

// Route files
const teams = require('./routes/teams');

// Load env vars
dotenv.config({ path: 'rest_api/config/config.env' });

const app = express();

// Mount routers
app.use('/api/v1/teams', teams);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
