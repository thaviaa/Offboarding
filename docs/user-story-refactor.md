# Enhancement - ITS - Offboarding - Route Remove Access catalog tasks from a configuration table

| Field | Value |
|---|---|
| Area | ITS - ServiceNow\ITPMO - ITS ServiceNow Operational FY27 |
| Iteration | _TBD_ |
| Story Points | 8 |
| Priority | 2 |
| Value area | Business |
| Related | 270088 (EFAX — Replace FlyDoc on Team Member Offboarding) |

## Description

As a ServiceNow administrator, I want the OFFBOARDING: Employee/Non-Employee - Remove Access catalog tasks to be routed from a configuration table instead of hardcoded department and assignment group sys_ids, so that support teams, departments and checklists can be added or changed without a code change and deployment.

## Acceptance Criteria

**AC1.** An Offboarding Task Route table is available to administrators. Each record defines an assignment group, the departments it applies to (or all departments), a checklist template, an order and an active flag.

**AC2.** When a new Team Member Offboarding request is submitted, an OFFBOARDING: Employee/Non-Employee - Remove Access catalog task is created for each active route that matches the team member's department, in route order.

**AC3.** For every department, a new Team Member Offboarding request creates the same catalog tasks, assignment groups, variables and checklist items as before this change.

**AC4.** When a new Team Member Offboarding request is submitted, a Service Desk II Remove Access catalog task is always created, including when the team member's department can't be determined.

**AC5.** When a route record is set to inactive, new Team Member Offboarding requests no longer create that route's catalog task.

**AC6.** When a route's checklist template is missing or invalid, the catalog task is still created without a checklist, an error is logged, and catalog tasks for the other routes are still created.

**AC7.** Existing Team Member Offboarding requests, catalog tasks and checklists — open and closed — are unaffected.

## DEV/QA Note

- Design and cutover steps: `docs/subflow-design.md`. Table definition and seed data: `table/u_offboarding_task_route.md`.
- Seed the routes with `scripts/seed_routes.js`, running it with `DRY_RUN = true` first.
- AC3: `scripts/verify_routing_parity.js` must report **PARITY OK** across all departments before the flow is switched.
- Test at least one department per route, plus a team member with no department.
- Route records and checklist templates are data. Capture them with `scripts/add_records_to_update_set.js`.
- Keep the legacy Application Tasks to Support Groups action deactivated (not deleted) for one release as a rollback.

## Open questions for BA

1. Public Health Department currently gets an ITS Apps LUESA and Library task. Is that intended?
2. Land Use and Environmental Services Agency gets both CAO Support and LUESA and Library tasks. Is that intended?
3. ITS Apps Finance routing is commented out in the current script. Should the route stay inactive?
