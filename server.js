require ('dotenv/config');

const express = require ('express');
const logger = require ('morgan');
const bodyParser = require ('body-parser');
const cors = require('cors')

const corsOptions ={
    origin:['http://localhost:3000', 'http://pharmacy-ui.test'],
    methods:['POST', 'GET', 'PUT', 'UPDATE'], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const Router = require ('./src/Routes/index');
const server = express();
const port = process.env.PORT || 3030;
const nodeEnv = 'Development';

server.listen(port, () => {
  console.log(`Server is running in port ${port} in ${nodeEnv} Mode`);
});

server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
// server.use(cors(corsOptions))
server.use(cors);

server.use('/', Router);

module.exports = server;
