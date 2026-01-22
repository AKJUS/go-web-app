---
"go-web-app": minor
---

Update Local Units Externally Managed working mechanism

- Changing a local unit type to "Externally managed" will convert all "Validated" local unit type to "Externally Managed"
- Changing back from externally managed will convert all local units to "Validated" type
- Switching to "Externally managed" is disabled if there are "Unvalidated" or "Validation" local units.
