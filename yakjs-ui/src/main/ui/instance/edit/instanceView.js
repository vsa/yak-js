/**
 * InstanceView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.InstanceViewModel} viewModel
 */
yak.ui.InstanceView = function InstanceView(parent, context, viewModel) {
    'use strict';

    /**
     *  @type {yak.ui.InstanceView}
     */
    var self = this;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('panelInstanceEdit');

    /**
     * @type {yak.ui.Template}
     */
    var selectPluginTemplate = context.template.load('selectPluginItem');

    this.name = context.ko.observable('');
    this.port = context.ko.observable('');
    this.description = context.ko.observable('');

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceView.constructor', self);
        parent.html(template.build());

        //$('#instance-save', parent).click(handleSaveClick);

        viewModel.onInstanceInfoChanged = handleInstanceInfoChanged;
        viewModel.onSelectPluginItemsChanged = createPluginList;
        context.ko.applyBindings(self, parent[0]);

        $('.plugin-list', parent).click(handleSelectPluginClick);
    }

    /**
     * View is being activated.
     * @param [data]
     */
    this.activate = function activate(data) {
        viewModel.activate(data);
    };

    /**
     *
     * @param event
     */
    function handleSelectPluginClick(event) {
        var plugin = $(event.target).closest('.select-plugin-item');
        var pluginName = plugin.attr('data-plugin-name');

        viewModel.togglePluginSelection(pluginName);
    }

    /**
     * Handle Instance Info Changed event.
     */
    function handleInstanceInfoChanged() {
        console.log('InstanceView.handleInstanceInfoChanged', viewModel.instanceItem);

        if (viewModel.instanceItem) {
            self.name(viewModel.instanceItem.name);
            self.description(viewModel.instanceItem.description);
            self.port(viewModel.instanceItem.port);
        } else {
            self.name('');
            self.description('');
            self.port('');
        }

        createPluginList();
    }

    /**
     *
     */
    function createPluginList() {

        var html = '';

        _.each(viewModel.selectPluginItems, function(plugin) {
            html += selectPluginTemplate.build(plugin);
        });

        $('.plugin-list', parent).html(html);
    }

    /**
     * Handle Save Button Click
     */
    this.handleSaveClick = function handleSaveClick() {
        var instanceItem = new yak.ui.InstanceItem();
        instanceItem.name = self.name();
        instanceItem.description = self.description();
        instanceItem.port = self.port();

        viewModel.createOrUpdate(instanceItem);
    };


    /**
     * Handle cancel button click
     */
    this.handleCancelClick = function handleCancelClick() {
        viewModel.cancel();
    };

    constructor();
};