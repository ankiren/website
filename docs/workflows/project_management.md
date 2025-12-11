# Jira Agile Issue Workflow

This document describes Jira agile issue workflows for the Ankiren project.

---

## Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| UAT | uat.ankiren.com | User acceptance testing |
| Staging | staging.ankiren.com | Pre-production testing |
| Production | ankiren.com | Live application |

---

## Feature Workflow

For Stories, Tasks, and new features.

```
[Backlog] → [Selected] → [In Progress] → [Code Review] → [QA Passed] → [UAT Testing] → [Ready To Deploy Staging] → [Testing in Staging] → [Ready To Deploy Production] → [Production Verified] → [Done]
```

| Status | Category | Environment | Description |
|--------|----------|-------------|-------------|
| Backlog | To Do | - | Prioritized but not started |
| Selected | To Do | - | Selected for current sprint |
| In Progress | In Progress | Development | Active development |
| Code Review | In Progress | Development | PR submitted, awaiting review |
| QA Passed | In Progress | Development | Passed QA testing in dev |
| UAT Testing | Testing | UAT | Business validation in UAT env |
| Ready To Deploy Staging | Deployment | - | Approved for staging deployment |
| Testing in Staging | Testing | Staging | Verification in staging env |
| Ready To Deploy Production | Deployment | - | Approved for production deployment |
| Production Verified | Done | Production | Confirmed working in production |
| Done | Done | - | Fully complete and closed |

---

## Bug Workflow

For defects and issues.

```
[Reported] → [Under Investigation] → [In Progress] → [Fixed] → [UAT Testing] → [Ready To Deploy Staging] → [Testing in Staging] → [Ready To Deploy Production] → [Production Verified] → [Closed]
                    ↓                      ↓              ↓                ↓                  ↓                      ↓                      ↓
              [Cannot Reproduce]      [Won't Fix]    [Reopen]         [Reopen]           [Reopen]               [Reopen]               [Reopen]
```

| Status | Category | Environment | Description |
|--------|----------|-------------|-------------|
| Reported | To Do | - | Bug reported, awaiting triage |
| Under Investigation | In Progress | Development | Analyzing root cause |
| In Progress | In Progress | Development | Actively fixing |
| Fixed | In Progress | Development | Code fix completed |
| UAT Testing | Testing | UAT | Verified fix in UAT env |
| Ready To Deploy Staging | Deployment | - | Approved for staging deployment |
| Testing in Staging | Testing | Staging | Verified fix in staging env |
| Ready To Deploy Production | Deployment | - | Approved for production deployment |
| Production Verified | Done | Production | Confirmed fix in production |
| Closed | Done | - | Bug fully resolved |
| Cannot Reproduce | Closed | - | Unable to replicate the issue |
| Won't Fix | Closed | - | Decided not to fix |

---

## References

- [6 Steps to Better Release Management in Jira - Atlassian](https://www.atlassian.com/blog/jira-software/jira-release-management-steps)
- [Jira Workflow Best Practices - Idalko](https://idalko.com/blog/jira-workflow-best-practices)
- [Workflow Status Best Practices - Atlassian Community](https://community.atlassian.com/forums/Jira-questions/Workflow-Status-Best-Practices-for-Software-Projects-That/qaq-p/2570249)
