const redis = require( 'redis' );
const config = require( './configuration' );

const client = redis.createClient( config( `db.redis` ));

module.exports = client;
