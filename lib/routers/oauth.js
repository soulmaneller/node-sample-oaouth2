const express   = require( 'express' );
const router    = express.Router();
const _         = require( 'lodash' );
const oauth     = require( '../oauth' );

router.all( '/token', ( req, res ) => {
    oauth.token( req, res, function( err, result ) {
        if( err ) {
            return res.resp.error( err.message );
        }
        let output = _.pick( result, [ 'accessToken', 'accessTokenExpiresAt', 'refreshToken', 'refreshTokenExpiresAt', 'user' ]);
        res.resp.ok( 'login success', output );
    });
});

module.exports = router;
