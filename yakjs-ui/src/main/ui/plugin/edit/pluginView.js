/* global CodeMirror:false */

/**
 * PluginListView
 * @constructor
 * @param {yak.ui.ViewContext} context
 * @param {jQuery} parent
 * @param {yak.ui.PluginViewModel} viewModel
 */
yak.ui.PluginView = function PluginView(parent, context, viewModel) {
    'use strict';

    /**
     * @type {yak.ui.PluginView}
     */
    var self = this;

    /**
    * @type {null|CodeMirror}
    */
    var codeEditor = null;

    /**
     * @type {yak.ui.Template}
     */
    var template = context.template.load('panelPluginEdit');

    /**
     * Form:  Name of the plugin
     */
    this.name = context.ko.observable('');

    /**
     * Form: Description of the plugin
     */
    this.description = context.ko.observable('');

    this.classStateSyntaxError = context.ko.observable('');
    this.classStateSyntaxErrorTitle = context.ko.observable('');

    this.editorCursorLine = context.ko.observable(0);
    this.editorCursorColumn = context.ko.observable(0);

    /**
     * Constructor
     */
    function constructor() {
        console.log('yak.ui.InstanceView.constructor', self);
        parent.html(template.build());

        //$('#instance-save', parent).click(handleSaveClick);

        viewModel.onPluginItemChanged = handlePluginItemChanged;
        context.ko.applyBindings(self, parent[0]);

        CodeMirror.commands.autocomplete = yak.ui.codeEditorAutoComplete;
        CodeMirror.commands.autodocument = yak.ui.codeEditorAutoDocument;

        codeEditor = new CodeMirror($('#codeEditor')[0], {
            value:  '',
            mode:  'javascript',
            lineNumbers: false,
            indentUnit: 4,
            extraKeys: { 'Ctrl-Space': 'autocomplete', 'Ctrl-D': 'autodocument' }
        });

        codeEditor.on('change', handleCodeEditorChange);
        codeEditor.on('cursorActivity', handleCodeCursorActivity);
    }

    /**
     * Display the current cursor position in the editor status bar.
     * @param instance
     */
    function handleCodeCursorActivity(instance) {
        var cursorPosition = instance.getCursor();
        self.editorCursorLine(cursorPosition.line);
        self.editorCursorColumn(cursorPosition.ch);
    }

    /**
     * Handle if code in editor was change to perform a syntax check.
     */
    function handleCodeEditorChange(doc, change) {
        console.log('handleCodeEditorChange');

        try {
            var code = codeEditor.getValue();
            (function() {
                //noinspection JSHint
                new Function('return ' + code)();
            })();
            self.classStateSyntaxError('');
            self.classStateSyntaxErrorTitle('');
        } catch(ex) {
            console.log(change);
            console.log(ex);

            self.classStateSyntaxError('state-syntax-error');

            var title = 'Last code change was done near ' + change.from.line + ':' + change.from.ch;
            self.classStateSyntaxErrorTitle(title);
        }
    }

    /**
     * Activate view
     * @param {string|object} [data]
     */
    this.activate = function activate(data) {
        $('.error-line', parent).hide();
        viewModel.activate(data);
    };

    /**
     * Handle plugin item changed event.
     */
    function handlePluginItemChanged() {
        console.log('InstanceView.handleInstanceInfoChanged', viewModel.instanceItem);

        if (viewModel.pluginItem) {
            self.name(viewModel.pluginItem.name);
            self.description(viewModel.pluginItem.description);
            codeEditor.setValue(viewModel.pluginItem.code);
        } else {
            self.name('');
            self.description('');
            codeEditor.setValue(yak.ui.EmptyPluginTemplate.toString());
        }
    }

    /**
     * Handle Save Button Click
     */
    this.handleSaveClick = function handleSaveClick() {
        var pluginItem = new yak.ui.PluginItem();
        pluginItem.name = self.name();
        pluginItem.description = self.description();
        pluginItem.code = codeEditor.getValue();

        viewModel.createOrUpdate(pluginItem);
    };

    /**
     * Handle cancel button click
     */
    this.handleCancelClick = function handleCancelClick() {
        viewModel.cancel();
    };

    constructor();
};