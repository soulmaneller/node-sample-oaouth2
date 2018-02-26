const mysql = require( './mysql-driver' );
const config = require( './configuration' );

let queue = [];
let connection = {
    query: function() {
        let params = Array.prototype.slice.call( arguments );
        queue.push( params );
    }
};
mysql( config( 'db.mysql' ), ( err, db ) => {
    if( err ) {
        console.log( `----------------- err -----------------` );
        console.log( err );
        throw new Error( `MySQL Error` );
    }
    connection.query = db.query;
    queue.forEach(( params ) => {
        db.query.apply( null, params );
    });
});

module.exports = connection;
