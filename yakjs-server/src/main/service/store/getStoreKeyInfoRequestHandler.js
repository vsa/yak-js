/**
 * GetStoreKeyInfoRequestHandler
 * @constructor
 * @param {yak.YakServer} yakServer
 * @implements {yak.ServiceMessageHandler}
 */
yak.GetStoreKeyInfoRequestHandler = function GetStoreKeyInfoRequestHandler(yakServer) {

    'use strict';

    var store = yak.require('store');

    /**
    * @param {yak.api.GetStoreKeyInfoRequest} request
    * @param {yak.WebSocketConnection} connection
    */
    this.handle = function handle(request, connection) {

        try {
            var logger = yakServer.getLogger();
            logger.debug('GetStoreKeyInfoRequestHandler', { request: request });

            var response = new yak.api.GetStoreKeyInfoResponse();
            response.requestId = request.id;

            var storeData = store.getStore();

            response.keys = [];

            _.each(storeData, function(entry) {
                response.keys.push({key: entry.key, description:entry.description});
            });

            connection.send(response);
        } catch (ex) {
            yakServer.serviceInstance.log.error(ex.message);
        }
    };
};