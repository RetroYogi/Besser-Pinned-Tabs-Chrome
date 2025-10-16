# Besser Pinned Tabs - Firefox extension

Protects pinned tabs against unintentional closures and prevents opening a different website inside a pinned tab.

## Chrome-only features (Firefox already handles this behaviour natively)
- Automatically reopens pinned tabs if they're accidentally closed, whether using keyboard shortcuts or mouse clicks.
- When you click a link to a different website in a pinned tab, opens it in a new tab instead of replacing your pinned page.

## Chrome and Firefox features
- If you type a new address in a pinned tab's address bar, opens it as a new tab to preserve your pinned page 

## Firefox only features (to be added in Chrome)
- When you click ANY link in a pinned tab, opens it in a new tab instead of replacing your pinned page.
  (Except for same-URL links, to prevent a tab being duplicated when refreshing a page)

The extension runs silently in the background with no configuration needed.
Open source and privacy-friendly: No data collection.
It does have some limitation an annoyances (Sometimes a pinned page refreshs. The browser's home button click is not intercepted) due to technical limitations about how and when it is possible to intercept a link.
https://github.com/RetroYogi/Besser-Pinned-Tabs/