// Store pinned tabs
let pinnedTabs = {};

// Keep track of recent redirects by URL per tab
let tabRedirects = {};

// Helper function to check if a URL is from a different domain
function isDifferentDomain(url1, url2) {
  try {
    const domain1 = new URL(url1).hostname;
    const domain2 = new URL(url2).hostname;
    return domain1 !== domain2;
  } catch (e) {
    return false;
  }
}

// Helper to get domain from URL string
function getDomain(urlString) {
  try {
    return new URL(urlString).hostname;
  } catch (e) {
    return "";
  }
}

// Function to update pinned tabs upon extension activation
function updatePinnedTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.pinned) {
        pinnedTabs[tab.id] = { url: tab.url, index: tab.index };
      }
    }
  });
}

// Call this function after background script loads
updatePinnedTabs();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.pinned) {
    // Store the current tab info
    pinnedTabs[tabId] = { url: tab.url, index: tab.index };
    
    // Reset redirect tracking only when URL actually changes in the address bar
    // This prevents the redirect loop because a redirect to the same page won't reset our tracking
    if (changeInfo.url) {
      // Only reset tracking for domains other than the one we're currently on
      // This way we maintain knowledge of domains we've redirected from
      const currentDomain = getDomain(tab.url);
      
      if (tabRedirects[tabId]) {
        // Don't completely reset - just remove the current domain from tracking
        // to prevent future redirects to it from opening in new tabs
        delete tabRedirects[tabId][currentDomain];
      }
    }
  } else {
    delete pinnedTabs[tabId]; // Remove from pinnedTabs if unpinned
    delete tabRedirects[tabId]; // Clean up redirect tracking
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
  
  // Clean up tracking data
  delete tabRedirects[tabId];
});

// Listen for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pinned) {
    pinnedTabs[tab.id] = { url: tab.url, index: tab.index };
  }
});

// Listen for navigation events - this now handles both address bar navigation 
// and link clicks
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return; // Only handle main frame navigation

  chrome.tabs.get(details.tabId, (tab) => {
    if (tab.pinned && isDifferentDomain(tab.url, details.url)) {
      // Initialize tracking for this tab if needed
      if (!tabRedirects[tab.id]) {
        tabRedirects[tab.id] = {};
      }
      
      // Extract domain for tracking
      const targetDomain = getDomain(details.url);
      
      // Check if we've seen this domain before in this tab
      if (tabRedirects[tab.id][targetDomain]) {
        // This is at least the second attempt to navigate to this domain
        // Allow the navigation to proceed (by doing nothing)
        // This breaks potential redirect loops
        return;
      }
      
      // First time seeing this domain, mark it as seen
      tabRedirects[tab.id][targetDomain] = true;
      
      // Cancel the navigation in the pinned tab
      chrome.tabs.update(details.tabId, { url: tab.url });
      
      // Open the new URL in a new tab
      chrome.tabs.create({ url: details.url, index: tab.index + 1 });
    }
  });
});