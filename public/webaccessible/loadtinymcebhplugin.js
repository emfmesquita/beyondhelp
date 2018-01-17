(function () {
    const jqEditors = $(Cobalt.TinyMCE.selector);
    if (jqEditors.length === 0) return;

    // enables to close tiny windows when click outside them
    const enableCloseByClickOut = function () {
        $(document).on('click', '#mce-modal-block', function () {
            tinyMCE.activeEditor.windowManager.close();
        });
    };

    // loads the beyond help tinymce plugin
    const loadBhTinyMCEPlugin = function () {
        const executeWhenConditionMet = function (conditionFunction, toExecute) {
            const interval = setInterval(() => {
                if (!conditionFunction()) return;
                clearInterval(interval);
                toExecute();
            }, 100);
        };

        const tinyLoaded = () => typeof tinymce !== "undefined" && tinymce.editors.length > 0;

        // hide all editors untill load BH stuff too
        const jqMarkupRoots = jqEditors.parents(".markup-editor");
        jqMarkupRoots.addClass("BH-Tinymce-loading");

        executeWhenConditionMet(tinyLoaded, () => {
            // destroy all tinymce editors
            tinymce.remove();
            Cobalt.TinyMCE.initialized = false;
            Cobalt.TinyMCE.optionsOverridden = true;

            // adds BH tinymce plugin
            if (!Cobalt.TinyMCE.options.external_plugins) Cobalt.TinyMCE.options.external_plugins = {};
            Cobalt.TinyMCE.options.external_plugins.beyondhelp = `chrome-extension://${BeyondHelp.id}/webaccessible/tinymcebhplugin.js`;

            // adds BH button on toolbar
            if (BeyondHelp.config.editorButton && (BeyondHelp.config.tooltipsTab || BeyondHelp.config.tablesTab)) {
                Cobalt.TinyMCE.options.toolbar = Cobalt.TinyMCE.options.toolbar + ",|,beyondhelp";
            }

            // adds fullscreen button on toolbar
            if (BeyondHelp.config.fullscreenButton) {
                Cobalt.TinyMCE.options.toolbar = Cobalt.TinyMCE.options.toolbar + ",|,bhfullscreen";
                Cobalt.TinyMCE.options.plugins = Cobalt.TinyMCE.options.plugins + ",fullscreen";
            }

            //Cobalt.TinyMCE.options.table_toolbar = "tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol";

            // reloads all editors and shows them
            Cobalt.TinyMCE.initialize();
            executeWhenConditionMet(tinyLoaded, () => jqMarkupRoots.removeClass("BH-Tinymce-loading"));
        });
    };

    // listen messages from bh tinymce dialogs
    window.addEventListener("message", e => {
        if (e.origin !== `chrome-extension://${BeyondHelp.id}`) return;
        const action = e.data.action;
        const editor = tinymce.activeEditor;

        // message that requests to close the bh dialog
        if (action === "closetinymessage") editor.windowManager.close();

        // message that requests to add content to tiny editor
        if (action === "addcontenttotinymessage") editor.insertContent(e.data.content);

        // message that requests the selected rollable table
        if (action === "selectedtablemessage") {
            const jqTable = $(editor.selection.getNode()).closest("table.compendium-left-aligned-table");
            const tableHtml = jqTable.length === 0 ? "" : jqTable[0].outerHTML;

            const dialogWindow = editor.windowManager.getWindows()[0];
            dialogWindow.getContentWindow().postMessage({ id: BeyondHelp.id, action: "selectedtablemessage", tableHtml }, "*");
        }

        // message that requests to update a rollable table
        if (action === "updateselectedtablemessage") {
            const jqTable = $(editor.selection.getNode()).closest("table.compendium-left-aligned-table");
            if (jqTable.length > 0) {
                jqTable.replaceWith(e.data.content);
                editor.windowManager.close();
            };
        }
    });

    enableCloseByClickOut();
    loadBhTinyMCEPlugin();
})();