/**
 * GetLogInfoResponse
 * @constructor
 */
yak.api.GetLogInfoResponse = function GetLogInfoResponse() {

    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.getLogInfo';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * List of log information.
     * @type {Array.<yak.api.LogInfo>}
     */
    this.logs = [];
};