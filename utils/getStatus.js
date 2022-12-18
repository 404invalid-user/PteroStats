const axios = require('axios');
const processlog = require('./processlog');


module.exports = async function() {
    processlog.info("Getting nodes stats");
    const nodes = []

    const panel = {
        status: false,
        servers: -1,
        users: -1,
    }

    const requestConfig = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.PANEL_TOKEN
        }
    }

    //first make sure panel is online before spamming a down panel or incorrect config with requests
    try {
        await axios(process.env.PANEL_URL, requestConfig);
        panel.status = true;
    } catch (error) {
        processlog.error(error.stack || error);
        if (error.response.status === 403) {
            processlog.warn("error status: 403\nendpoint: " + process.env.PANEL_URL + "\nyou have provided an invalid api key or one that does not have permission to request this endpoint please double check config or join the support server and ask there");
        } else if (error.response.status === 404) {
            processlog.warn("error status: 404\nendpoint: " + process.env.PANEL_URL + "\nyou have requestend an endpoint that does not exist please double check config or join the support server and ask there");
        } else {
            processlog.warn("error status: " + err.response.status + "\nendpoint: " + process.env.PANEL_URL + "\nan unknown error has occurred your panel is most-likely down if not please double check config or join the support server and ask there");
        }

        panel.status = false;
        return { panel, nodes };
    }

    try {
        const resUsers = await axios(process.env.PANEL_URL + '/api/application/users', requestConfig);
        panel.users = resUsers.data.meta.pagination.total;
    } catch (error) {
        processlog.error(error.stack || error);
        if (error.response.status === 403) {
            processlog.warn("error status: 403\nendpoint: " + process.env.PANEL_URL + "/api/application/users\nyou have provided an invalid api key or one that does not have permission to request this endpoint please double check config or join the support server and ask there");
        } else if (error.response.status === 404) {
            processlog.warn("error status: 404\nendpoint: " + process.env.PANEL_URL + "/api/application/users\nyou have requestend an endpoint that does not exist please double check config or join the support server and ask there");
        } else {
            processlog.warn("error status: " + err.response.status + "\nendpoint: " + process.env.PANEL_URL + "/api/application/users\nan unknown error has occurred your panel is most-likely down if not please double check config or join the support server and ask there");
        }
    }


    try {
        const resServers = await axios(process.env.PANEL_URL + '/api/application/servers', requestConfig);
        panel.servers = resServers.data.meta.pagination.total;
    } catch (error) {
        processlog.error(error.stack || error);
        if (error.response.status === 403) {
            processlog.warn("error status: 403\nendpoint: " + process.env.PANEL_URL + "/api/application/servers\nyou have provided an invalid api key or one that does not have permission to request this endpoint please double check config or join the support server and ask there");
        } else if (error.response.status === 404) {
            processlog.warn("error status: 404\nendpoint: " + process.env.PANEL_URL + "/api/application/servers\nyou have requestend an endpoint that does not exist please double check config or join the support server and ask there");
        } else {
            processlog.warn("error status: " + err.response.status + "\nendpoint: " + process.env.PANEL_URL + "/api/application/servers\nan unknown error has occurred your panel is most-likely down if not please double check config or join the support server and ask there");
        }
    }

    try {
        const resNodes = await axios(process.env.PANEL_URL + '/api/application/nodes?include=servers,location,allocations', requestConfig);

        //loop though nodes and make a nice array of their data
        for (const node of resNodes.data.data) {
            const nodeData = {
                id: node.attributes.id,
                name: node.attributes.name,
                location: node.attributes.relationships.location.attributes.short,
                allocations: node.attributes.relationships.allocations.data.length,
                status: true,
                public: node.attributes.public,
                maintenance: node.attributes.maintenance_mode,
                servers: node.attributes.relationships.servers.data.length,
                memory_min: node.attributes.allocated_resources.memory,
                memory_max: node.attributes.memory,
                disk_min: node.attributes.allocated_resources.disk,
                disk_max: node.attributes.disk,
            }
            try {
                //get token to make direct request to node
                const resNode = await axios(process.env.PANEL_URL + '/api/application/nodes/' + node.attributes.id + '/configuration', requestConfig);
                //senrd direct to node to make sure its actually online
                await axios(node.attributes.scheme + '://' + node.attributes.fqdn + ':' + node.attributes.daemon_listen + '/api/servers', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + resNode.data.token
                    }
                });
            } catch (error) {
                nodeData.status = false;
                processlog.error(error.stack || error);
                if (error.response.status === 403) {
                    processlog.warn("error status: 403\nendpoint: " + node.attributes.scheme + "://" + node.attributes.fqdn + ":" + node.attributes.daemon_listen + "/api/servers\nyou have provided an invalid api key or one that does not have permission to request this endpoint please double check config or join the support server and ask there");
                } else if (error.response.status === 404) {
                    processlog.warn("error status: 404\nendpoint: " + node.attributes.scheme + "://" + node.attributes.fqdn + ":" + node.attributes.daemon_listen + "/api/servers\nyou have requestend an endpoint that does not exist please double check config or join the support server and ask there");
                } else {
                    processlog.warn("error status: " + err.response.status + "\nendpoint: " + node.attributes.scheme + "://" + node.attributes.fqdn + ":" + node.attributes.daemon_listen + "/api/servers\nan unknown error has occurred your node is most-likely down if not please double check config or join the support server and ask there");
                }
            }

            nodes.push(nodeData);
        }
    } catch (error) {
        processlog.error(error.stack || error);
        if (error.response.status === 403) {
            processlog.warn("error status: 403\nendpoint: " + process.env.PANEL_URL + "/api/application/nodes\nyou have provided an invalid api key or one that does not have permission to request this endpoint please double check config or join the support server and ask there");
        } else if (error.response.status === 404) {
            processlog.warn("error status: 404\nendpoint: " + process.env.PANEL_URL + "/api/application/nodes\nyou have requestend an endpoint that does not exist please double check config or join the support server and ask there");
        } else {
            processlog.warn("error status: " + err.response.status + "\nendpoint: " + process.env.PANEL_URL + "/api/application/nodes\nan unknown error has occurred your panel is most-likely down if not please double check config or join the support server and ask there");
        }
    }
    return { panel, nodes };

}