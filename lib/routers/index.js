const express   = require( 'express' );
const router    = express.Router();

const routes    = {
    oauth   : require( './oauth' ),
    user    : require( './user' ),
    register: require( './register' ),
};
router.get( '/', ( req, res ) => {
    res.send( 'api home' );
});

for( let name in routes ) {
    router.use( `/${ name }`, routes[ name ]);
}

module.exports = router;
