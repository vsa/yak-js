/**
 * SetStoreValueResponse
 * @constructor
 */
yak.api.SetStoreValueResponse = function SetStoreValueResponse() {
    'use strict';

    /**
     * Command for the service API.
     * @type {string}
     */
    this.type = 'response.setStoreValue';

    /**
     * The original request id.
     * @type {null}
     */
    this.requestId = null;

    /**
     * Was setting store value successful.
     * @type {boolean}
     */
    this.success = true;
};