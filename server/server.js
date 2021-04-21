const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool ({
    database: 'jazzy_sql',
    host: 'localHost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 30000
});

pool.on('connect', () => {
    console.log('Postgresql connected!!! Woott!!');
});

pool.on('error', error => {
    console.log('Error with postgres pool', error)
});

// TODO - Replace static content with a database tables
// const artistList = [ 
//     {
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },       
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [
//     {
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

// Retrieving artist data from the database
app.get('/artist', (req, res) => {
    console.log(`In /songs GET`);
    // 
    let queryText = 'SELECT * FROM "artist" ORDER BY "birthdate" DESC;';
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch(error => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);    
        })
});

app.post('/artist', (req, res) => {
    const artist = {
        name: req.body.name,
        birthdate: req.body.birthdate
    };

    //Create INSERT query to write new things into DB
    const queryText = `INSERT INTO "artist" (name, birthdate)
                        VALUES ($1, $2);`;
    pool.query(queryText, [req.body.name, req.body.birthdate])
        .then(result => {
            console.log('New artist is..', result);
            // validation to only send an CREATED status if .rows property is NOT empty.
            if(result.row !== []) {
            res.sendStatus(201);
            }
        })
        .catch(error => {
            console.log(`Something went wrong with ${queryText}`, error);
            res.sendStatus(500);
        })
    
});

//Retrieving song data from the Database
app.get('/song', (req, res) => {
    console.log(`In /songs GET`);
    // res.send(songList);
    let queryText = 'SELECT * FROM "song" ORDER BY "title";';
    pool.query(queryText)
        .then(dbResult => {
            res.send(dbResult.rows);
        })
        .catch(error => {
            console.log(`Error! It broke trying to query ${queryText}`, error);
            res.sendStatus(500);    
        })
});

app.post('/song', (req, res) => {
    const song = {
        title: req.body.title,
        length: req.body.length,
        released: req.body.released
    };

    

    const queryText = `INSERT INTO "song" (title, length, released)
                        VALUES ($1, $2, $3);`;
    pool.query(queryText, [req.body.title, req.body.length, req.body.released])
        .then(result => {
            console.log('The new song is...', result);
            if(result.row !== []) {
            res.sendStatus(201);
            }
        })
        .catch(error => {
            console.log(`Something went wrong with ${queryText}`, error);
            res.sendStatus(500);
        })
});


