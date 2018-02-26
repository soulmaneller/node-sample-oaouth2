const request = require( 'supertest' );
const { expect } = require( 'chai' );
const app = require( '../server.js' ).app;

const req = request( app );

function login( username, password, callback ) {
    req.post( '/oauth/token' )
        .set( 'Content-Type', 'application/x-www-form-urlencoded' )
        .send({
            username: username,
            password: password,
            grant_type: 'password',
            client_id: 'foo',
        })
        .expect( 200 )
        .end( callback );
}

describe( `/register`, () => {
    it( `Should added data`, ( done ) => {
        req.post( '/register' )
            // .set( 'Authorization', `Bearer ${ token.accessToken }` )
            .set( 'Content-Type', 'application/x-www-form-urlencoded' )
            .send({
                username: 'sample3',
                password: 'sample3',
                name: 'Sample 003',
            })
            .expect( 200 )
            .expect(( res => {
                const data = res.body;
                if( data.status !== 'ok' ) {
                    throw new Error( 'Add data failured' );
                }
            }))
            .end( done );
    });
});

describe( `/user`, () => {
    describe( `/`, () => {
        let token = '';
        before(( done ) => {
            login( 'sample3', 'sample3', ( err, result ) => {
                if( err ) {
                    return done( err );
                }
                token = result.body.data;
                done();
            });
        });

        it( `Should not through authenticate`, ( done ) => {
            req.get( '/user' )
            .expect( 401, { "status": "error", "msg": "Unauthorized request: no authentication given" })
            .end( done );
        });

        it( `Should get profile data`, ( done ) => {
            req.get( '/user' )
                .set( 'Authorization', `Bearer ${ token.accessToken }` )
                .expect( 200 )
                .expect( res => {
                    const data = res.body.data;
                    if( data.username !== 'sample3' ) {
                        throw new Error( 'Data not added' );
                    }
                })
                .end( done );
        });

        it( `Should get user profile ( now user )`, ( done ) => {
            req.get( '/user' )
                .set( 'Authorization', `Bearer ${ token.accessToken }` )
                .expect( 200 )
                .expect(( res => {
                    const data = res.body.data;
                    if( data.username !== 'sample3' ) {
                        throw new Error( 'Data not added' );
                    }
                }))
                .end( done );
        });

        it( `Should update user profile`, ( done ) => {
            function getProfile( err, res ) {
                req.get( '/user' )
                    .set( 'Authorization', `Bearer ${ token.accessToken }` )
                    .set( 'Content-Type', 'application/x-www-form-urlencoded' )
                    .expect( 200 )
                    .expect(( res => {
                        const data = res.body.data;
                        if( data.name !== 'new name' ) {
                            throw new Error( 'Data not updated' );
                        }
                    }))
                    .end( done );

            }
            req.put( '/user' )
                .set( 'Authorization', `Bearer ${ token.accessToken }` )
                .send({ name: 'new name' })
                .expect( 200 )
                .expect(( res => {
                    const data = res.body;
                    if( data.status !== 'ok' ) {
                        throw new Error( 'Data update failured' );
                    }
                }))
                .end( getProfile );
        });

        it( `Should delete user profile`, ( done ) => {
            req.delete( '/user' )
                .set( 'Authorization', `Bearer ${ token.accessToken }` )
                .expect( 200 )
                .expect(( res => {
                    const data = res.body;
                    if( data.status !== 'ok' ) {
                        throw new Error( 'Delete data failured' );
                    }
                }))
                .end( done );
        });
    });
});
