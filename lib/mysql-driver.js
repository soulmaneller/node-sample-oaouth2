const mysql = require( 'mysql' );

function create( config, callback ) {
    const pool = mysql.createPool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    });

    function query( sql, val, _callback ) {
        if( typeof val === 'function' ) {
            _callback = val;
            val = [];
        }
        pool.getConnection( function( err, conn ) {
            if( err ) {
                console.log( `----------------- getConnection : error -----------------` );
                return _callback( err );
            }
            conn.query( sql, val, releaseConnection( conn, _callback ));
        });
    }

    function releaseConnection( conn, cb ) {
        conn.release();
        return cb;
    }

    query( 'SELECT 1 + 1 AS solution', function( err, results, fields ) {
        if( err ) {
            return callback( err );
        }
        callback( null, {
            query: query
        });
    });
}

module.exports = create;
