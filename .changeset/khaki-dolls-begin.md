---
"@ifrc-go/ui": major
---

Introduce new, more strict/opinionated layout system. Update components to reflect the new layout system.

- Add base layout components
  - InlineLayout
  - BlockLayout
  - ButtonLayout
  - TabLayout
  - TabListLayout
- Add base views
  - ListView
  - Container (major restructure)
  - InlineView
- Update useSpacingToken
  - Add optical correction
  - Add option to add additional inline spacing
- Update spacing tokens
  - Add more tokens (5xs to 5xl)
  - Re-scale tokens to consider optical correction
- Update components to use new layout and spacing system
- Remove outdated components
  - BodyOverlay
  - Grid
  - Header
  - Footer
  - FilterBar
  - Overlay
- Remove outdated hooks
  - useBasicLayout
  - useSpacingTokens (replace with useSpacingToken)
- Update eslint config
