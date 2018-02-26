const express       = require( 'express' );
const router        = express.Router();
const OAuthServer   = require('oauth2-server');

const oauth = new OAuthServer({
    useErrorHandler: true,
    model: require( './model' ),
    requireClientAuthentication: {
        password: false
    },
});

let methods = {};
const methodsList = [ 'authenticate', 'authorize', 'token' ];
methodsList.forEach(( method ) => {
    methods[ method ] = ( req, res, opts, callback ) => {
        const request   = new OAuthServer.Request( req );
        const response  = new OAuthServer.Response( res );

        if( typeof opts === 'function' ) {
            callback = opts;
            opts = {};
        }

        return oauth[ method ]( request, response, opts, callback );
    };
});

methods.middleware = ( opts ) => {
    return ( req, res, next ) => {
        methods.authenticate( req, res, opts, function( err, token ) {
            if( err ) {
                if( err.message === 'Invalid accessToken' ) {
                    err.status = 400;
                }
                return next( err );
            }
            res.locals = token;
            next();
        });
    };
};

module.exports = methods;
