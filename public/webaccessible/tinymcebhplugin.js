(function () {
    tinymce.PluginManager.add("beyondhelp", function (editor, url) {
        "use strict";

        if (BeyondHelp.config.editorButton && (BeyondHelp.config.tooltipsTab || BeyondHelp.config.tablesTab)) {
            const openBhWindow = function () {
                editor.windowManager.open({
                    title: "Beyond Help",
                    url: url + "/tinymcebhdialog.html",
                    bodyType: "tabpanel",
                    width: 800,
                    height: 400
                });
            }

            editor.addButton("beyondhelp", {
                image: url + "/icon-black.svg",
                context: "tools",
                tooltip: "Beyond Help (Alt + B)",
                onclick: openBhWindow,
                onPostRender: function () {
                    if (!BeyondHelp.config.tablesTab) return;
                    const ctrl = this;
                    editor.on("NodeChange", e => {
                        const jqNode = $(editor.selection.getNode());
                        ctrl.active(jqNode.closest("table.compendium-left-aligned-table").length > 0);
                    });
                }
            });

            editor.shortcuts.add("alt+b", "Opens Beyond Help Window.", openBhWindow);
        }

        if (BeyondHelp.config.fullscreenButton) {
            const toggleFullScreeen = function () {
                editor.execCommand("mceFullscreen");

                const isFullScreen = $(".mce-fullscreen").length;
                const jqHeaders = $(".site-bar, header.main, #notifications");

                if (isFullScreen) {
                    jqHeaders.each(function (idx, element) {
                        element.style.setProperty("display", "none", "important");
                    });
                } else {
                    jqHeaders.show();
                }
            }

            editor.addButton("bhfullscreen", {
                icon: "fullscreen",
                context: "tools",
                tooltip: "Toggle Fullscreen (Alt + F)",
                onclick: toggleFullScreeen
            });

            editor.shortcuts.add("alt+f", "Toggle Fullscreen.", toggleFullScreeen);
        }
    });
})();