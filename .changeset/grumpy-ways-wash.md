---
"go-web-app": minor
---

Implement [ERU Readiness](https://github.com/IFRCGo/go-web-app/issues/1710)

- Restucture surge page to acommodate ERU
  - Move surge deployment related sections to a new dedicated tab **Active Surge Deployments**
    - Update active deployments to improve scaling of points in the map
    - Add **Active Surge Support per Emergency** section
  - Revamp **Surge Overview** tab
    - Add **Rapid Response Personnel** sub-tab
      - Update existings charts and add new related tables/charts
    - Add **Emergency Response Unit** sub-tab
      - Add section to visualize ERU capacity and readiness
      - Add section to view ongoing ERU deployments
      - Add a form to update ERU Readiness
      - Add option to export ERU Readiness data
- Update **Respond > Surge/Deployments** menu to include **Active Surge Deployments**
