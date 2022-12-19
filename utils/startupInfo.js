const axios = require('axios');
const fs = require('fs');
module.exports = async function() {
    console.log("Ready!");
    const latestVersion = await axios.get('https://raw.githubusercontent.com/404invalid-user/PteroStatus/main/package.json');
    const version = JSON.parse(fs.readFileSync('./package.json')).version;
    const isOutOfDate = version != latestVersion.version ? "(out of date)" : '';
    console.log(`┌────────────────────────────────────────────────────────┐\n│                     Ptero Status                       │\n├───────────────────────────┬────────────────────────────┤ \n│     Current Version:      │ ${version}  ${isOutOfDate} │\n├───────────────────────────┼────────────────────────────┤\n│     Support Server:       │ https://discord.gg/RYQbmj7 │\n└───────────────────────────┴────────────────────────────┘`);
    return;
}
