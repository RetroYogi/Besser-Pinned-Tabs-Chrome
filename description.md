# Besser Pinned Tabs
*Improving how pinned tabs work*

## Chrome Extension Store Description

Besser Pinned Tabs: Protect and Enhance Your Pinned Tabs

This extension improves how Chrome handles pinned tabs by protecting them against unintentional closures and preventing opening a different website inside a pinned tab.

1. Prevents accidental closure: If you try to close a pinned tab, it quickly reopens. This works whether you try to close the using a keyboard shortcut or using the contextual menu.

2. Smart link handling: Clicking links to different domains in pinned tabs opens them in new tabs.

3. Address bar protection: Entering a new URL in a pinned tab's address bar opens it in a new tab instead.

Besser Pinned Tabs keeps your important pinned tabs safe and your browsing organized. It works silently in the background, requiring no setup or interaction.

## Known Limitations

- **Internal browser pages**: The extension does not protect navigation on Chrome's internal pages (chrome://, about:, etc.) or when the browser first launches with a pinned tab on an internal page. This is by design to maintain minimal permissions and privacy. If you need to navigate from these pages, the URL will open in the pinned tab on first use.

Open source and privacy-friendly: No data collection. Code available on GitHub.

## Feature Comparison (Chrome vs Firefox)

### Chrome-only features (Firefox already handles this behaviour natively)
- Automatically reopens pinned tabs if they're accidentally closed, whether using keyboard shortcuts or mouse clicks.
- When you click a link to a different website in a pinned tab, opens it in a new tab instead of replacing your pinned page.

### Chrome and Firefox features
- If you type a new address in a pinned tab's address bar, opens it as a new tab to preserve your pinned page

### Firefox only features (to be added in Chrome)
- When you click ANY link in a pinned tab, opens it in a new tab instead of replacing your pinned page.
  (Except for same-URL links, to prevent a tab being duplicated when refreshing a page)

The extension runs silently in the background with no configuration needed.
Open source and privacy-friendly: No data collection.
It does have some limitation an annoyances (Sometimes a pinned page refreshs. The browser's home button click is not intercepted) due to technical limitations about how and when it is possible to intercept a link.
https://github.com/RetroYogi/Besser-Pinned-Tabs/
