/**
 * WorkspaceView
 * @class
 * @constructor
 * @param {cobu.wsc.ui.ViewContext} context
 * @param {$} parent
 */
cobu.wsc.ui.WorkspaceView = function WorkspaceView(parent, context)
{
   'use strict';

   /** @type {cobu.wsc.ui.WorkspaceView} */
   var self = this;

   var header = null;

   var instanceList = null;

   var panelViews = {};

   /** Constructor */
   function constructor() {

      header = new cobu.wsc.ui.HeaderView($('.header', parent), context);
      panelViews['panel-instance'] = new cobu.wsc.ui.InstanceListView($('.panel-instance', parent), context);
      panelViews['panel-instance-new'] = new cobu.wsc.ui.InstanceNewView($('.panel-instance-new', parent), context);
      panelViews['panel-plugin'] = new cobu.wsc.ui.PluginListView($('.panel-plugin', parent), context);
      panelViews['panel-plugin-edit'] = new cobu.wsc.ui.PluginEditView($('.panel-plugin-edit', parent), context);

      context.eventBus.on(cobu.wsc.ui.ActivatePanelCommand).register(handleActivatePanel);

      $('.menu li', parent).click(handleMenuItemClick);
      hidePanels();
   }

   /**
    * @param {cobu.wsc.ui.ActivatePanelCommand} command
    */
   function handleActivatePanel(command) {
      console.log('handleActivatePanel', command);
      activatePanel(command.panelName);
   }

   /**
    *
    * @param event
    */
   function handleMenuItemClick(event) {
      var target = $(event.currentTarget);
      var panelName = target.attr('data-panel');

      $('.menu li', parent).removeClass('state-active');
      target.addClass('state-active');

      activatePanel(panelName);
   }

   /**
    *
    * @param name
    */
   function activatePanel(name) {
      hidePanels();
      $('.panels .' + name, parent).show();

      if (panelViews.hasOwnProperty(name)) {
         panelViews[name].active();
      }
   }

   /**
    * Hide all panels.
    */
   function hidePanels() {
      $('.panels .panel', parent).hide();
   }

   constructor();
};