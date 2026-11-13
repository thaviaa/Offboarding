# Draft ADO story — Make offboarding task routing data-driven

**Type:** Enhancement · **Area:** ITS - ServiceNow · **Suggested points:** 8

## Description

As a ServiceNow administrator, I want the Team Member Offboarding catalog tasks to be routed by a configuration table instead of hardcoded department and group sys_ids, so that adding or changing a support team, department or checklist doesn't need a code change and deployment.

## Acceptance criteria

- **AC1.** A new table, Offboarding Task Route, defines which assignment group gets a Remove Access task, for which departments (or all departments), with which checklist template, in what order.
- **AC2.** For every department, a new offboarding request creates the same catalog tasks, assignment groups, variables and checklists as before the change. A parity script run against all departments reports no differences.
- **AC3.** A Service Desk II task is created for every offboarding request, including when no department can be determined.
- **AC4.** Deactivating a route row stops that task from being created on new requests, without a code change.
- **AC5.** If a checklist template is missing or invalid, the catalog task is still created, the error is logged, and the other teams' tasks are not affected.
- **AC6.** Existing open and closed offboarding requests and their tasks and checklists are unaffected.

## DEV / QA notes

- Design: `docs/subflow-design.md`. Table: `table/u_offboarding_task_route.md`.
- Seed with `scripts/seed_routes.js`. Verify with `scripts/verify_routing_parity.js`.
- The legacy action stays deactivated for one release as a rollback.
- Open questions for the BA:
  - Public Health → LUESA & Library task: intended?
  - LUESA gets both CAO and LUESA & Library tasks: intended?
  - Should the Finance route stay inactive?
