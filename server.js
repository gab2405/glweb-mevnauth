require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('./db/connection');
const history = require('connect-history-api-fallback');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// routes
app.use('/auth', require('./routes/auth'));

// handle static files
const staticFileMiddleware = express.static(__dirname + '/templates/glweb-mevnauth');
app.use(staticFileMiddleware);
app.use(history({
    disableDotRule: true,
    verbose: true
}));

// handle static folder
app.use('/', express.static(__dirname + '/templates/glweb-mevnauth'));

// catch 404 errors
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
})

// error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500
    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
})

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}...`)
});