const processlog = require('./processlog');
module.exports = function() {
    //faital will crash
    if (!process.env.WEBHOOK_URL || !process.env.WEBHOOK_URL.startsWith("http") || process.env.WEBHOOK_URL == 'https://discord.com/api/webhooks/foo/bar') {
        processlog.error("you have not set your webhook url corectly can't continue\nsee README for details or join the support server");
        return process.exit(1);
    }

    if (!process.env.PANEL_URL || !process.env.PANEL_URL.startsWith("http") || process.env.PANEL_URL == 'https://example.com') {
        processlog.error("you have not set your panel url corectly can't continue\nsee README for details or join the support server");
        return process.exit(1);
    }
    if (!process.env.PANEL_TOKEN || process.env.PANEL_TOKEN == "" || process.env.PANEL_TOKEN == " " || process.env.PANEL_TOKEN == '<place api token here>') {
        processlog.error("you have not set your panel url corectly can't continue\nsee README for details or join the support server");
        return process.exit(1);
    }
    if (process.env.RESOURCES_UNIT.toLocaleLowerCase() != 'tb' && process.env.RESOURCES_UNIT.toLocaleLowerCase() != 'gb' && process.env.RESOURCES_UNIT.toLocaleLowerCase() != 'mb' && process.env.RESOURCES_UNIT.toLocaleLowerCase() != 'percent') {
        processlog.error("you have not set your resources unit corectly can't continue\nsee README for details or join the support server");
        return process.exit(1);
    }

    //not faital
    if (!process.env.PING_INTERVAL || !Number.isInteger(process.env.PING_INTERVAL)) {
        processlog.warn("you have not set your ping interval corectly will default to 60 secconds\nsee README for details or join the support server");
    }
    if (!process.env.WEBHOOK_MESSAGE_ID || process.env.WEBHOOK_MESSAGE_ID.startsWith("<") || process.env.WEBHOOK_MESSAGE_ID == '00000000000000000000') {
        processlog.warn("no message id set webhook will send a new message each time\nsee README for more info")
    }

    return;
}