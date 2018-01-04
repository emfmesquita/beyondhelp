(function () {
    tinymce.PluginManager.add("beyondhelp", function (editor, url) {
        "use strict";

        const openBhWindow = function () {
            editor.windowManager.open({
                title: "Beyond Help",
                url: url + "/tinymcebhdialog.html",
                bodyType: "tabpanel",
                width: 400,
                height: 400
            });
        }

        editor.addButton("beyondhelp", {
            image: url + "/icon-black.svg",
            context: "tools",
            tooltip: "Beyond Help (Alt + B)",
            onclick: openBhWindow
        });

        editor.shortcuts.add("alt+b", "Opens Beyond Help Window.", openBhWindow);
    });
})();