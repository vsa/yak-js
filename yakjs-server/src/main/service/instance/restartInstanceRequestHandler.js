/**
 * RestartInstanceRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.RestartInstanceRequestHandler = function RestartInstanceRequestHandler(yakServer) {

    'use strict';

    /**
     * @type {yak.RestartInstanceRequestHandler}
     */
    var self = this;

    /**
     * Constructor
     */
    function constructor() {
    }

    /**
     * @param {yak.api.StartInstanceRequest} request
     * @param {yak.WebSocketConnection} connection
     */
    this.handle = function handle(request, connection) {
        try {
            yakServer.stopInstance(request.instanceName);
            yakServer.startInstance(request.instanceName);
            yakServer.updateAndSaveConfig();
            connection.send(new yak.api.RestartInstanceResponse());
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };

    constructor();
};