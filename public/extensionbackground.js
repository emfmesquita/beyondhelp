// only enable the extension for dndbeyound site
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'www.dndbeyond.com', schemes: ['https'] }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// listen the dndbeyound request to gather a monster info
// sends a message to the content script to render the add monster buttons
chrome.webRequest.onCompleted.addListener((details) => chrome.tabs.sendMessage(details.tabId, details), { urls: ["https://www.dndbeyond.com/monsters/*/more-info"] });

// listen when a monster is added from AddMonsterButton, adds a notification
chrome.runtime.onMessage.addListener((request, sender) => chrome.notifications.create(request.notificationid, request.notification));