# Subflow: Create Offboarding Access Tasks

Replaces step 2 (**Application Tasks to Support Groups**) of **Software flow(Offboarding)**. Steps 3–7 of the flow are unchanged.

## Inputs

| Name | Type |
|---|---|
| `requested_item` | Reference → `sc_req_item` (mandatory) |
| `user` | Reference → `sys_user` (whatever the legacy action received as `user`) |

## Outputs

| Name | Type |
|---|---|
| `task_count` | Integer |

## Steps

1. **Action: Resolve Offboarding Department**
   - `requested_item_sys_id` = `requested_item ▸ Sys ID`
   - `user_sys_id` = `user ▸ Sys ID`
2. **Look Up Records** — `Offboarding Task Route [u_offboarding_task_route]`
   - Conditions: `Active is true`
     AND (`All departments is true` **OR** `Departments contains` `1 ▸ department_sys_id`)
   - Order by `Order` ascending · Max results 50
3. **For Each** item in `2 ▸ Offboarding Task Route Records`
   1. **Create Record** — `Catalog Task [sc_task]`
      - Request item = `requested_item`
      - Assignment group = `3 ▸ Route ▸ Assignment group`
      - Short description = `3 ▸ Route ▸ Short description`
   2. **Action: Copy Variables to Task**
      - `task_sys_id` = `3.1 ▸ Catalog Task ▸ Sys ID`
      - `requested_item_sys_id` = `requested_item ▸ Sys ID`
      - leave names / sets blank → uses the `meck.offboarding.*` properties
   3. **If** `3 ▸ Route ▸ Checklist template` is not empty
      - **Action: Apply Checklist Template** (`task_sys_id`, `template_sys_id`)
      - **If** status = `error` → **Log** (warn) the message and continue. One bad template shouldn't block the other teams' tasks.
   4. Set flow variable `task_count` += 1
4. Assign subflow output `task_count`.

> **If the condition builder won't do `Departments contains` with a data pill** on a List field, replace step 2 with a tiny script action that runs the same encoded query as `scripts/verify_routing_parity.js → routeGroups()` and outputs the route sys_ids as an array.

## Order of operations is preserved

Routes are ordered 100…900, which creates tasks in the same order as the legacy if-blocks: CAO → DevOps → HHS Analyst → LUESA & Library → PRK → Service Desk II.

## Cutover

1. Build the table, actions and subflow in DEV, in a new update set.
2. Run `scripts/seed_routes.js` with `DRY_RUN = true` and check every name it prints. Then run it with `false`.
3. Run `scripts/verify_routing_parity.js`. It must print **PARITY OK**.
4. In the flow, replace step 2 with the subflow and map the inputs.
5. Test one department per route, plus a user with no department (should get Service Desk II only).
6. Capture the route rows: `scripts/add_records_to_update_set.js`.
7. Keep the legacy action deactivated, not deleted, for one release as a rollback.
