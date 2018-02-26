# Readme

## Prepare

**Note** This project tested on nodejs version `8.9.3`

- Install dependencies by command `npm install`

## Start server

### Using docker

**Note** Ports for containers

- nodejs: 3000
- mysql: 3306
- redis: 6379
- phpmyadmin: 8000

You can change port in file `docker/dev.yml`

- Execute command `npm run dev:up`
- Use phpmyadmin for importing sql script ( `sql/sample.sql` )

### Non - docker

#### Required

- MySQL server
- Redis server

#### Database

Import sql script ( `sql/sample.sql` ) to your MySQL database

#### Start

- Execute command `npm run init:config` for generating a configuration file ( `config/config.json` )
- Edit configuration file set your config
- Execute command `npm run serve`

## Test

- Execute command `CONFIG_FILE=test.json npm run init:config` for generating a configuration file for test (`config/config.json`)
- Edit configuration file set your config
- Execute command `npm test`

**Note**

`CONFIG_FILE` is a variable for setting configuration file name
