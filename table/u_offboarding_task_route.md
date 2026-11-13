# Table: `u_offboarding_task_route`

**Label:** Offboarding Task Route · **Scope:** Global · **Extends:** nothing

Each row says *"for these departments, create a Remove Access task for this group, using this checklist template."* Adding a team or a department becomes a data change instead of a code change.

## Fields

| Label | Column | Type | Notes |
|---|---|---|---|
| Name | `u_name` | String (100) | Display value, e.g. `Service Desk II` |
| Active | `u_active` | True/False | Default `true` |
| Order | `u_order` | Integer | Task creation order. Default `100` |
| Assignment group | `u_assignment_group` | Reference → `sys_user_group` | Mandatory |
| All departments | `u_all_departments` | True/False | `true` for Service Desk II (always created) |
| Departments | `u_departments` | List → `cmn_department` | Ignored when All departments = true |
| Checklist template | `u_checklist_template` | Reference → `checklist_template` | Optional. Reference qual: `nameLIKE(Offboarding)` |
| Short description | `u_short_description` | String (160) | Default `OFFBOARDING: Employee/Non-Employee - Remove Access` |

Set `u_name` as the display field.

## Access

- Read: `itil`
- Create / write / delete: `admin` (or a dedicated `u_offboarding_route_admin` role if Service Desk leads should maintain it)

## Seed data (mirrors the legacy if-blocks)

Department names come from the comments in the legacy script. **Verify each sys_id → name in DEV** before relying on them; `scripts/seed_routes.js` prints the actual names.

| Order | Name | Group sys_id | Departments | Template | Active |
|---|---|---|---|---|---|
| 100 | CAO Support | `87329e3c97fb9550cc467d021153af93` | `d078c76e…afa4` (County Assessor's), `1078c76e…afa7` (LUESA), `1c78c76e…afb4` (Tax Collector) | CAO Support Applications (Offboarding) | ✅ |
| 200 | ITS Apps Finance | `0332deb09773995030aab2a3f153af04` | `1478c76e…afa6` (Public Health), `9078c76e…afa5` (DSS) | Finance Support Applications (Offboarding) | ❌ (commented out in legacy) |
| 300 | ITS Apps DevOps | `cb329eb09773995030aab2a3f153af17` | `1c78c76e…afa4` (CSS), `1478c76e…afa6` (Public Health), `d078c76e…afa7` (Medical Examiner) | DevOps Support Applications (Offboarding) | ✅ |
| 400 | ITS Apps HHS Analyst | `8f32deb09773995030aab2a3f153af1c` | same as DevOps | HHS Analyst Support Applications (Offboarding) | ✅ |
| 500 | ITS Apps LUESA and Library | `83329eb09773995030aab2a3f153afeb` | `1478c76e…afa6` (Public Health), `1078c76e…afa7` (LUESA) | LUESA and Library Support Applications (Offboarding) | ✅ |
| 600 | PRK Support | `8f329eb09773995030aab2a3f153af55` | `9478c76e…afa7` (County Manager's), `9c78c76e…afa5` (Financial Services), `1c78c76e…afa7` (Park & Rec), `d478c76e…afa6` (HR), `5478c76e…afa5` (OED) | PRK Support Applications (Offboarding) | ✅ |
| 900 | Service Desk II | `cf329eb09773995030aab2a3f153afac` | **All departments** | Service Desk II Support Applications (Offboarding) | ✅ |

### Things worth confirming with the BA while seeding

- The LUESA & Library block fires for **Public Health**, and the comment's department list doesn't obviously fit that team. Confirm it's intentional.
- Finance is disabled in code. Seeding it inactive keeps the history and makes re-enabling a checkbox.
- `1078c76e…afa7` (LUESA) gets **both** CAO and LUESA & Library tasks. Confirm.

## System properties

| Name | Value |
|---|---|
| `meck.offboarding.task_variables` | `requested_for,supervisor_name,email_address,telephone_number,vs_effective_date` |
| `meck.offboarding.task_variable_sets` | `e420534897b1e11064a937671153afca,751c557d97379150500675611153afed,1e31bb6093381a10af8c39ddfaba10f9` |

## Update sets

Table, fields, ACLs and properties are captured automatically. **Route rows and checklist templates are data** — capture them with `scripts/add_records_to_update_set.js`.
