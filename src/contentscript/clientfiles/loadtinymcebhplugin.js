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

        const jqMarkupRoots = jqEditors.parents(".markup-editor");
        jqMarkupRoots.addClass("BH-Tinymce-loading");

        executeWhenConditionMet(tinyLoaded, () => {
            tinymce.remove();
            Cobalt.TinyMCE.initialized = false;
            Cobalt.TinyMCE.optionsOverridden = true;
            Cobalt.TinyMCE.options.toolbar = Cobalt.TinyMCE.options.toolbar + ",|,beyondhelp";
            if (!Cobalt.TinyMCE.options.external_plugins) Cobalt.TinyMCE.options.external_plugins = {};
            Cobalt.TinyMCE.options.external_plugins.beyondhelp = `chrome-extension://${window.beyondhelpid}/tinymcebhplugin.js`;

            Cobalt.TinyMCE.initialize();
            executeWhenConditionMet(tinyLoaded, () => jqMarkupRoots.removeClass("BH-Tinymce-loading"));
        });
    };

    enableCloseByClickOut();
    loadBhTinyMCEPlugin();
})();