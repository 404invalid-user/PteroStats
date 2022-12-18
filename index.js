//uncomment if your are not using the petro egg and wish to use the .env file
//require('dotenv').config();


const ENVCheck = require('./utils/ENVCheck');
const getStatus = require('./utils/getStatus');
const processlog = require('./utils/processlog');
const sendStatus = require('./utils/sendStatus');
const startupInfo = require('./utils/startupInfo');

async function doStatus() {
    const data = await getStatus();
    await sendStatus(data.panel, data.nodes);
    return;
}

ENVCheck();
startupInfo();
doStatus();
setInterval(doStatus, process.env.PING_INTERVAL * 1000);