const express   = require( 'express' );
const router    = express.Router();
const model     = require( '../../models/users' );

router.post( '/', ( req, res, next ) => {
    const params = {
        data: req.body,
    };
    model.addUser( params, ( err, result ) => {
        if( err ) {
            return next( err );
        }
        res.resp.ok( "Success", result );
    });
});

module.exports = router;
