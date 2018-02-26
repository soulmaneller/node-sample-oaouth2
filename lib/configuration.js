(function () {
    "use strict";
    const fs    = require( 'fs-extra' );
    const path  = require( 'path' );
    const _     = require( 'lodash' );

    let configFile = 'config.json';

    if( process.env.CONFIG_FILE ) {
        configFile = process.env.CONFIG_FILE;
    }
    let configPath = path.join( "config", configFile ),
        _defaultConfig = {
            server: {
                port: 3000
            },
            db: {
                mysql: {
                    host: "mysql",
                    user: "root",
                    password: "root",
                    database: "sample"
                },
                redis: {
                    host: 'redis',
                    port: 6379
                }
            }
        },
        config;

    if( fs.existsSync( configPath )) {
        try {
            config = fs.readJSONSync( configPath );
        } catch (e) {
            config = {};
        }

        config = _.merge( _defaultConfig, config );
    } else {
        config = _defaultConfig;
    }

    fs.outputJsonSync( configPath, config, { spaces: 4 });
    module.exports = _.get.bind( this, config );
}());
