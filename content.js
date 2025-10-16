function isExtensionReady() {
  return !!chrome.tabs && !!chrome.tabs.query; // Check for both chrome.tabs and its query function
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link && link.href && isExtensionReady()) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].pinned) {
        chrome.runtime.sendMessage({ action: "openInNewTab", url: link.href });
        event.preventDefault(); // Prevent default behavior immediately
      }
    });
  }
});
