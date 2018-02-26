const request = require( 'supertest' );
const app = require( '../server.js' ).app;

const req = request( app );
describe( `Error handler`, () => {
    it( `Should get message 'api home'`, ( done ) => {
        req.get( '/' )
            .expect( 200, 'api home', done );
    });

    it( `Should return error 404`, ( done ) => {
        req.get( '/err404' )
            .expect( 404, done );
    });

    it( `Should return error 400`, ( done ) => {
        req.post( '/register' )
            .send( {} )
            .expect( 400, done );
    });
});
