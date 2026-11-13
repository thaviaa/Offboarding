# Offboarding — ServiceNow (Mecklenburg County ITS)

Work on the **Team Member Offboarding** catalog item, the *OFFBOARDING: Employee/Non-Employee - Remove Access* catalog tasks it creates, and **Software flow(Offboarding)**.

## Layout

| Path | What |
|---|---|
| `current/` | Legacy "Application Tasks to Support Groups" action script, as deployed. Baseline only — don't deploy. |
| `actions/` | New Flow Designer action scripts: Resolve Offboarding Department, Copy Variables to Task, Apply Checklist Template |
| `table/` | `u_offboarding_task_route` definition, seed data, system properties |
| `scripts/` | Background scripts: seed routes, verify parity, add data records to an update set |
| `docs/` | Story 270088 notes, subflow design, refactor user story |

## How offboarding tasks are created today

1. The catalog item triggers **Software flow(Offboarding)**.
2. Step 2 runs a script that:
   - looks up the user's department
   - creates one `sc_task` per matching team, using hardcoded if-blocks of department and group sys_ids
   - always creates a Service Desk II task
   - copies variables onto each task
   - builds each checklist from a `checklist_template` found **by name**
3. Steps 4–6 wait for every task to close, then step 7 updates the RITM.

## Where it's going

The routing moves into the `u_offboarding_task_route` table, and step 2 becomes a subflow built from three small actions. See [`docs/subflow-design.md`](docs/subflow-design.md).

## Stories

- **270088** — Replace FlyDoc with Electronic Faxing Services on the Service Desk II checklist → [`docs/story-270088.md`](docs/story-270088.md)
- **Refactor user story** → [`docs/user-story-refactor.md`](docs/user-story-refactor.md)
