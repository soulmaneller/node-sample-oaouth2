const _         = require( 'lodash' );
const mysql     = require( '../lib/mysql-client' );
const util      = require( '../lib/utilities' );

let priv = {};
let methods = {};

const schema = {
    username: {
        isAlphanumeric: null,
        isLength: { min: 3 },
    },
    password: {
        isLength: { min: 6 }
    },
    name: {
        isLength: { min: 1 }
    }
};

priv.getUserData = ( rawData ) => {
    let output = _.pick( rawData, [ 'id', 'username', 'name' ]);
    return output;
};

methods.getUserByUsernameAndPassword = ( username, password, callback ) => {
    const params = [ username, password ];
    mysql.query( `SELECT * FROM users WHERE username = ? AND password = PASSWORD( ? )`, params, ( err, result ) => {
        if( err ) {
            return callback( err );
        }
        if( result === null || result.length === 0 ) {
            return callback( `User not exists` );
        }

        callback( null, priv.getUserData( result[ 0 ]));
    });
};

methods.getProfile = ( obj, callback ) => {
    mysql.query( `SELECT * FROM users WHERE id = ?`, [ obj.id ], ( err, result ) => {
        if( err ) {
            return callback( err );
        }
        if( result === null || result.length === 0 ) {
            return callback( `User not exists` );
        }
        callback( null, priv.getUserData( result[ 0 ]));
    });
};

methods.addUser = ( obj, callback ) => {
    const cols = [ 'username', 'password', 'name' ];
    const data = obj.data;
    let isValid = util.validFields( data, schema );
    if( isValid !== true ) {
        const err = new Error( 'Invalid input data' );
        err.status = 400;
        return callback( err );
    }

    const params = cols.map( col => data[ col ]);
    mysql.query( `INSERT INTO users ( username, password, name ) VALUES ( ?, PASSWORD( ? ), ? )`, params, ( err ) => callback( err ));
};

methods.updateUser = ( obj, callback ) => {
    const sch = _.pick( schema, [ 'name' ]);
    const data = obj.data;
    let isValid = util.validFields( data, sch );
    if( isValid !== true ) {
        const err = new Error( 'Invalid input data' );
        err.status = 400;
        return callback( err );
    }
    const params = [ obj.data.name, obj.id ];
    mysql.query( `UPDATE users SET name = ? WHERE id = ?`, params, ( err ) => callback( err ));
};

methods.deleteUser = ( obj, callback ) => {
    const params = [ obj.id ];
    mysql.query( `DELETE FROM users WHERE id = ?`, params, ( err ) => callback( err ));
};

module.exports = methods;
