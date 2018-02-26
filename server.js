const express       = require( 'express' );
const cookieParser  = require( 'cookie-parser' );
const bodyParser    = require( 'body-parser' );
const http          = require( 'http' );

const config        = require( './lib/configuration' );
const routes        = require( './lib/routers' );
let app             = express(),
    app_config      = {
        config      : config,
        app         : app,
    };

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }));
app.use( cookieParser() );

// Custom request, response
app.use(( req, res, next ) => {
    function responseData( status, msg, data ) {
        return {
            status : status,
            msg    : msg,
            data   : data
        };
    }

    function resp( status, msg, data ) {
        let res_data = responseData( status, msg, data );

        res.json( res_data );
    }

    res.resp = {
        ok: resp.bind( null, 'ok' ),
        error: resp.bind( null, 'error' ),
    };
    next();
});

/*
 * Routers
 */
app.use( '/', routes );


// catch 404 and forward to error handler
app.use(( req, res, next ) => {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
});

// error handler
app.use(( err, req, res, next ) => {
    // console.log( err );
    res.status( err.status || 500 );
    res.resp.error( err.message );
});

/*
 * Starting server
 */
function run() {
    let port = config( 'server.port', 3000 );
    app.set( 'port', port );

    let server = http.createServer( app );
    server.listen( port );
    server.on( 'error', onError );
    server.on( 'listening', onListening );

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError( error ) {
        if ( error.syscall !== 'listen' ) {
            throw error;
        }

        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch( error.code ) {
            case 'EACCES':
                console.error( bind + ' requires elevated privileges' );
                process.exit( 1 );
                break;
            case 'EADDRINUSE':
                console.error( bind + ' is already in use' );
                process.exit( 1 );
                break;
            default:
                throw error;
          }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
        console.log( 'Listening on ' + bind );
    }
}
app_config.run      = run;

module.exports = app_config;
