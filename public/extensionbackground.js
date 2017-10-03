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

chrome.webRequest.onCompleted.addListener((details) => chrome.tabs.sendMessage(details.tabId, details), { urls: ["https://www.dndbeyond.com/monsters/*/more-info"] });