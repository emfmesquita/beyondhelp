// listen the dndbeyound request to gather a monster info
// sends a message to the content script to render the add monster buttons
chrome.webRequest.onCompleted.addListener((details) => chrome.tabs.sendMessage(details.tabId, details), { urls: ["https://www.dndbeyond.com/monsters/*/more-info"] });

// listen when a monster is added from AddMonsterButton, adds a notification
chrome.runtime.onMessage.addListener((request, sender) => {
    chrome.notifications.getAll((notifications) => {
        const notificationIds = Object.keys(notifications);
        if (notificationIds.length >= 3) {
            notificationIds.pop();
            notificationIds.pop();
            notificationIds.forEach(id => chrome.notifications.clear(id, () => { }));
        }
        chrome.notifications.create(request.notificationid, request.notification);
    });
});