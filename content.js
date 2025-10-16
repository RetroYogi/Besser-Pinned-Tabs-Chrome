document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (link && link.href) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].pinned) { // Check if the active tab is pinned
        chrome.runtime.sendMessage({ action: "openInNewTab", url: link.href });
        event.preventDefault(); // Prevent default behavior immediately
      }
    });
  }
});