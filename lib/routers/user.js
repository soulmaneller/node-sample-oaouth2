const express   = require( 'express' );
const router    = express.Router();
const oauth     = require( '../oauth' );
const model     = require( '../../models/users' );

router.use( oauth.middleware() );

router.all( '/', ( req, res, next ) => {
    const fnMap = {
        get: 'getProfile',
        put: 'updateUser',
        delete: 'deleteUser'
    };
    const method = req.method.toLowerCase();

    if( !fnMap.hasOwnProperty( method )){
        let err = new Error( 'Not found' );
        err.status = 404;
        return next( err );
    }
    const params = {
        id: res.locals.user.id,
        data: req.body,
    };
    model[ fnMap[ method ]]( params, ( err, result ) => {
        if( err ) {
            return res.resp.error( err.sqlMessage );
        }
        res.resp.ok( "Success", result );
    });
});

module.exports = router;
