tinymce.PluginManager.add('beyondhelp', function (editor, url) {
    "use strict";
    let activeTab;

    editor.addButton('beyondhelp', {
        image: url + '/icon-black.svg',
        context: 'tools',
        tooltip: 'Beyond Help',
        onclick: function () {
            editor.windowManager.open({
                title: 'Beyond Help',
                url: url + "/tinymcebhdialog.html",
                bodyType: 'tabpanel',
                width: 500,
                height: 350
            });
        }
    });
});