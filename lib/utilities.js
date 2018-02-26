const validator = require( 'validator' );

let methods = {};

methods.json2str = ( json ) => {
    let output = '';
    try {
        output = JSON.stringify( json );
    } catch (e) {
        console.log( `Cannot convert json to string` );
    } finally {
        return output;
    }
};

methods.str2json = ( str ) => {
    output = {};
    try {
        output = JSON.parse( str );
    } catch (e) {
        console.log( `Cannot convert string to json` );
    } finally {
        return output;
    }
};

methods.validFields = ( data, schema ) => {
    let stats = {};
    for( let name in schema ) {
        for( let method in schema[ name ]) {
            let opts = schema[ name ][ method ] || undefined;
            let input = data[ name ] !== undefined ? data[ name ].toString() : '';

            let output = validator[ method ]( input, opts );
            if( output !== true ) {
                stats[ name ] = `Invalid field ${ name }`;
            }
        }
    }

    if( Object.keys( stats ).length > 0 ) {
        return stats;
    }
    return true;
};

module.exports = methods;
