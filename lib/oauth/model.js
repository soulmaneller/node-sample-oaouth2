const mysql = require( '../mysql-client' );
const redis = require( '../redis-client' );
const util  = require( '../utilities' );
const userModel = require( '../../models/users' );

const model = {
    getAccessToken: function( accessToken, callback ) {
        redis.get( accessToken, ( err, result ) => {
            if( err ) {
                return callback( `Cannot get token from redis` );
            }

            if( result === null ) {
                return callback( `Invalid accessToken` );
            }

            let output = util.str2json( result );
            output.accessTokenExpiresAt = new Date( output.accessTokenExpiresAt );
            callback( null, output );
        });
    },

    getClient: function( client_id, client_secret ) {
        return {
            id: client_id,
            grants: [ 'password' ]
        };
    },

    getUser: function( username, password, callback ) {
        userModel.getUserByUsernameAndPassword( username, password, ( err, result ) => {
            if( err ) {
                return callback( err );
            }
            callback( null, result );
        });
    },

    saveToken: ( token, client, user, callback ) => {
        token.client = client;
        token.user = user;
        redis.set( token.accessToken, util.json2str( token ), ( err ) => {
            if( err ) {
                return callback( `Cannot save token to redis` );
            }
            callback( null, token );
        });
    },
};

module.exports = model;
