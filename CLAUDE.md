# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Besser Pinned Tabs** is a Chrome Manifest V3 extension that protects pinned tabs against unintentional closures and prevents opening different websites inside pinned tabs. The extension operates silently in the background with no user interaction required.

Core functionality:
1. Auto-reopens pinned tabs if accidentally closed
2. Opens cross-domain links in new tabs instead of replacing pinned tab content
3. Opens address bar navigation to different domains in new tabs

## Architecture

### Service Worker (background.js)

The extension uses a **service worker** architecture (Manifest V3 requirement) with `background.js` as the entry point.

**State Management:**
- `pinnedTabs` object: Tracks tab IDs with their URL and index position (persisted to chrome.storage.local)
- `tabRedirects` object: Tracks domains per tab to prevent infinite redirect loops (persisted to chrome.storage.local)
- State persistence prevents loss during service worker dormancy (v1.0.9)

**Key Navigation Logic:**
- Uses `chrome.webNavigation.onBeforeNavigate` API (not content scripts) for intercepting navigation
- Redirect loop prevention: Allows the second attempt to navigate to the same domain to break redirect chains (e.g., login redirects)
- Domain comparison via `isDifferentDomain()` determines when to open new tabs

**Event Listeners:**
- `onUpdated`: Tracks pinned status and URL changes, manages redirect tracking cleanup, persists state
- `onRemoved`: Recreates closed pinned tabs at their original index, persists state
- `onCreated`: Registers newly created pinned tabs, persists state
- `onMoved`: Tracks tab reordering to keep indices up-to-date (v1.0.9)
- `webNavigation.onBeforeNavigate`: Intercepts cross-domain navigation in pinned tabs (main frame only, frameId === 0), includes error handling (v1.0.9)

### Content Script (content.js)

**Note:** The content script exists in the codebase but is **not currently active** (not declared in manifest.json). The extension previously used content scripts but switched to the webNavigation API for better privacy (no host permissions required).

If re-enabling content scripts, they would need to be registered in manifest.json with appropriate host permissions.

## Development Commands

This is a simple Chrome extension with no build process. To develop:

1. **Load extension in Chrome:**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the repository directory

2. **Testing changes:**
   - After making code changes, go to `chrome://extensions/`
   - Click the reload icon on the extension card
   - Test with pinned tabs immediately

3. **Debugging:**
   - Background script console: Click "service worker" link in extension card
   - Use `chrome.tabs.query({pinned: true})` to inspect pinned tabs state

## Key Implementation Details

**Service Worker State Persistence (v1.0.9):**
- Problem: Service workers go dormant after ~30 seconds, losing all state
- Solution: State persists to `chrome.storage.local` via `persistState()` function
- State automatically reloads when service worker wakes up (background.js:8-15)
- Requires "storage" permission in manifest.json

**Bookmark Click Detection (v1.0.9):**
- Problem: Bookmark clicks changed tab URL before navigation event fired
- Solution: Compare against stored "canonical" URL instead of current `tab.url` (background.js:146)
- Fallback to `tab.url` if not yet stored (handles race conditions)

**Memory Leak Prevention (v1.0.9):**
- Problem: `tabRedirects` accumulated domains indefinitely
- Solution: Delete entire `tabRedirects[tabId]` when empty (background.js:80-82)
- Prevents unbounded memory growth during long sessions

**Redirect Loop Fix (v1.0.8):**
- Problem: Login redirects caused infinite tab creation
- Solution: `tabRedirects[tabId][domain]` tracks seen domains per tab
- Second navigation attempt to same domain is allowed to proceed
- Canonical URL now updates after allowed redirects to stay in sync (background.js:68-72)

**Permission Minimization (v1.0.6):**
- Removed `<all_urls>` host permissions
- Removed content script injection
- Uses `webNavigation` API instead (requires only "webNavigation" permission)
- Trade-off: Brief visual flash when clicking links, but better privacy

**Tab Restoration:**
- When pinned tab closes, recreated at exact same index position (background.js:99-114)
- Cleanup of both `pinnedTabs` and `tabRedirects` on tab removal

## Version Management

Current version in manifest.json: 1.0.9

When incrementing version:
1. Update `version` field in manifest.json
2. Add entry to changelog.md with version number and changes
3. Commit with descriptive message (follow existing commit style from git log)
