const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
import { Application } from 'express';

/**
 * Provide environment variables
 */
dotenv.config()

/**
 * Connect to database
 */
const connectToDB = require('./database/connection');
connectToDB();

/**
 * Init the express server
 */
const app: Application = express();

/**
 * Basic middlewares
 */
app.use(express.json());
app.use(cors())
app.use(cookieParser());

/**
 * Routes
 */
app.get('/', (req, res) => {
  res.send('mevn server')
});

app.use('/user', require('./routes/RouteUser'))


/**
 * Start server
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});