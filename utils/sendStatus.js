const axios = require('axios');
const processlog = require('./processlog');


function makeEmbed(panel, nodes) {
    let embed = {
        title: process.env.EMBED_TITLE,
        description: "",
        fields: [],

        footer: {
            text: "",
        },
        date: new Date()
    };

    if (process.env.EMBED_THUMBNAIL && process.env.EMBED_THUMBNAIL.startsWith('http')) embed['thumbnail'] = { url: process.env.EMBED_THUMBNAIL };


    const date = new Date();
    date.setSeconds(date.getSeconds() + process.env.PING_INTERVAL);
    if (process.env.EMBED_NEXTUPDATE_TIMER == 'true' || process.env.EMBED_NEXTUPDATE_TIMER == true || process.env.EMBED_NEXTUPDATE_TIMER == 1) embed.description += "next update in <t:" + Math.floor(date.getTime() / 1000) + ":R>";

    embed.description += `\n\n__**Panel Status**__\n__Status:__ ${panel.status ==true? process.env.EMBED_STATUS_ONLINE : process.env.EMBED_STATUS_OFFLINE}\n__Users:__ ${panel.users}\n__Servers:__ ${panel.servers}\n\n__**Node Status (${nodes.length})**__`;
    //embed.color = panel.status == true ? process.env.EMBED_COLOUR_ONLINE : process.env.EMBED_COLOUR_OFFLINE;
    for (const node of nodes) {
        let fieldValue = "```yml\n";
        switch (process.env.RESOURCES_UNIT) {
            case 'tb':
                fieldValue += `[RAM: ${Math.floor(node.memory_min / (1024 * 1000)).toLocaleString()}TB / ${Math.floor(node.memory_max / (1024 * 1000)).toLocaleString()}TB]\n[Disk: ${Math.floor(node.disk_min / (1024 * 1000)).toLocaleString()}TB / ${Math.floor(node.disk_max / (1024 * 1000)).toLocaleString()}TB]`;
                break;
            case 'gb':
                fieldValue += `[RAM: ${Math.floor(node.memory_min / 1024).toLocaleString()}GB / ${Math.floor(node.memory_max / 1024).toLocaleString()}GB]\n[Disk: ${Math.floor(node.disk_min / 1024).toLocaleString()}GB / ${Math.floor(node.disk_max / 1024).toLocaleString()}GB]`;
                break;
            case 'percent':
                fieldValue += `[RAM: ${Math.floor(node.memory_min / node.memory_max * 100).toLocaleString()}%]\n[Disk: ${Math.floor(node.disk_min / node.disk_max * 100).toLocaleString()}%]`;
                break;
            default:
                fieldValue += `[RAM: ${Math.floor(node.memory_min).toLocaleString()}MB / ${Math.floor(node.memory_max).toLocaleString()}MB]\n[Disk: ${Math.floor(node.disk_min).toLocaleString()}MB / ${Math.floor(node.disk_max).toLocaleString()}MB]`;
        }
        fieldValue += `\n[Locations: ${node.location}]\n[Servers: ${node.servers}]\n\`\`\``;

        embed.fields.push({
            name: `${node.name} ${node.status == true ? process.env.EMBED_STATUS_ONLINE : process.env.EMBED_STATUS_OFFLINE} ${node.maintenance == true ? "(under maintenance)" : ""}`,
            value: fieldValue
        });
    }

    embed.footer.text = `updates every ${process.env.PING_INTERVAL}s | ${process.env.EMBED_FOOTER}`;
    return embed
}

module.exports = async function(panel, nodes) {
    const embed = makeEmbed(panel, nodes);

    if (process.env.WEBHOOK_MESSAGE_ID && !process.env.WEBHOOK_MESSAGE_ID.startsWith("<") && process.env.WEBHOOK_MESSAGE_ID !== '00000000000000000000') {
        try {
            await axios.patch(process.env.WEBHOOK_URL + '/messages/' + process.env.WEBHOOK_MESSAGE_ID, { embeds: [embed] }, {
                headers: { 'User-Agent': 'PteroStatus/1.0.0 by 404invalid-user' }
            });

        } catch (error) {
            processlog.error(error.stack || error);
            processlog.warn("could not edit your message have you set your message id correctly?\nsee README for details or join the support server")
        }
    } else {
        try {
            await axios.post(process.env.WEBHOOK_URL, { embeds: [embed] }, {
                headers: { 'User-Agent': 'PteroStatus/1.0.0 by 404invalid-user' }
            })
        } catch (error) {
            if (!error.includes('unexpected end of file')) {
                processlog.error(error.stack || error);
                processlog.warn("could not send your message have you set your webhook url correctly?\nsee README for details or join the support server")
            } else {
                processlog.warn("unexpected end of file error with axios this is fine no clue why it does it maybe you do?")
            }
        }
    }
    processlog.success("send message");
    return;
}