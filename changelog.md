# 1.0.9
## Critical Bug Fixes & Performance Improvements
- **Fixed critical service worker dormancy issue**: Extension state now persists to chrome.storage, preventing complete failure after 30 seconds of inactivity
- **Fixed bookmark click detection**: Bookmarks clicked in pinned tabs now correctly open in new tabs instead of replacing the pinned tab content
- **Fixed memory leak**: Redirect tracking data now properly cleans up, preventing unbounded memory growth during long browsing sessions
- **Fixed canonical URL synchronization**: After redirect loops resolve, the stored URL now stays synchronized with the actual tab URL
- **Added tab reordering support**: Extension now tracks when tabs are moved, ensuring new tabs open at correct positions
- **Improved error handling**: Added proper error handling for race conditions when tabs are closed during navigation events
- **Added storage permission**: Required for state persistence across service worker restarts

## Documentation
- Added "Known Limitations" section to description.md explaining behavior with internal browser pages (chrome://, about:, etc.)

# 1.0.8
## Bug Fixes
- Fixed issue with infinite redirect loops in pinned tabs. Previously, if a pinned tab kept redirecting to another domain (such as login redirects), it would continually open new tabs. This has been resolved by allowing the second redirect attempt to the same domain.

# 1.0.6
## Security & Privacy Improvements
- Removed host permissions requirement (`<all_urls>`)
- Eliminated content scripts in favor of using the webNavigation API
- Simplified codebase by removing message passing between content and background scripts

Note: This update may result in a brief visual flash when clicking links in pinned tabs, but provides enhanced privacy by reducing required permissions.

# 1.0.5
Updated description in the manifest

# 1.0.4
Removed unused storage permission

# 1.0.3
## Bug fixes
- Improvement: Added functionality to identify pinned tabs upon extension activation. This ensures the extension immediately recognizes which tabs are protected. (Implemented in background.js)
- Fix: Resolved an issue where the extension blocked CMD-W (or Ctrl-W) for tabs that were previously pinned and then unpinned. Now, the extension only blocks the shortcut for currently pinned tabs. (Modified background.js)
- Fix: Addressed a bug in content.js that caused a "TypeError: Cannot read properties of undefined (reading 'query')" error. The script now checks for extension availability before using the chrome.tabs API. (Modified content.js)
- Fixed an issue where clicking a link to a different domain inside a pinned tab sometimes opened two new tabs instead of one.

# 1.0.0
Initial release