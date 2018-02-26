const request = require( 'supertest' );
const { expect } = require( 'chai' );
const app = require( '../server.js' ).app;

const req = request( app );

function login( username, password ) {
    return req.post( '/oauth/token' )
        .set( 'Content-Type', 'application/x-www-form-urlencoded' )
        .send({
            username: username,
            password: password,
            grant_type: 'password',
            client_id: 'foo',
        });
}

describe( `/oauth`, () => {
    describe( `/token`, () => {
        it( `Should login success`, ( done ) => {
            login( 'sample1', 'sample1' )
                .expect( 200 )
                .expect( res => {
                    let data = res.body.data;
                    let list = [ 'accessToken', 'refreshToken', 'user' ];
                    list.forEach(( item ) => {
                        if( !data.hasOwnProperty( item )) {
                            throw new Error( `${ item } not exists` );
                        }
                    });

                })
                .end( done );
        });

        it( `Should login failure`, ( done ) => {
            login( 'sample1', 'sample2' )
                .expect( 200, { status: 'error', msg: 'User not exists' })
                .end( done );
        });
    });
});
