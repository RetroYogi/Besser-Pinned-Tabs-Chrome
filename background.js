// Store pinned tabs
let pinnedTabs = {};

// Helper function to check if a URL is from a different domain
function isDifferentDomain(url1, url2) {
  return new URL(url1).hostname !== new URL(url2).hostname;
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.pinned) {
    pinnedTabs[tabId] = { url: tab.url, index: tab.index };
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (pinnedTabs[tabId]) {
    chrome.tabs.create(
      { url: pinnedTabs[tabId].url, pinned: true, index: pinnedTabs[tabId].index },
      (newTab) => {
        pinnedTabs[newTab.id] = { url: newTab.url, index: newTab.index };
        delete pinnedTabs[tabId];
      }
    );
  }
});

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pinned) {
    pinnedTabs[tab.id] = { url: tab.url, index: tab.index };
  }
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only handle main frame navigation

  chrome.tabs.get(details.tabId, (tab) => {
    if (tab.pinned && isDifferentDomain(tab.url, details.url)) {
      // Cancel the navigation in the pinned tab
      chrome.tabs.update(details.tabId, { url: tab.url });
      // Open the new URL in a new tab
      chrome.tabs.create({ url: details.url, index: tab.index + 1 });
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openInNewTab") {
    chrome.tabs.get(sender.tab.id, (tab) => {
      if (tab.pinned && isDifferentDomain(tab.url, request.url)) {
        chrome.tabs.create({ url: request.url, index: tab.index + 1 });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // Indicates we will send a response asynchronously
  }
});