chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ enabled: true, blockedCount: 0 });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateBlockedCount") {
        chrome.storage.local.get(['blockedCount'], (result) => {
            const newCount = (result.blockedCount || 0) + request.count;
            chrome.storage.local.set({ blockedCount: newCount });
        });
    }
});
