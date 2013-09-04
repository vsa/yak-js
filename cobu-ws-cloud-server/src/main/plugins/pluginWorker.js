/**
 * PluginWorker
 * @interface
 */
cobu.wsc.PluginWorker = function PluginWorker(name) {

    'use strict';

    /** @type {cobu.wsc.PluginWorker} */
    var self = this;

    /**
     * Plugin name
     * @type {string}
     */
    this.name = name;

    /** Constructor */
    function constructor() {
    }

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onInitialize = function onInit(instance) {};

    /**
     * @param {cobu.wsc.WebSocketConnection} connection
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onNewConnection = function onNewConnection(connection, instance) {};

    /**
     * @param {cobu.wsc.WebSocketMessage} message
     * @param {cobu.wsc.WebSocketConnection} connection
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onMessage = function onMessage(message, connection, instance) {};

    /**
     * @param {cobu.wsc.WebSocketInstance} instance
     */
    this.onTerminate = function onInit(instance) {};

    constructor();
};