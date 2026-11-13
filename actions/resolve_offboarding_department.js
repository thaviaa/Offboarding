/**
 * Flow Designer Action: "Resolve Offboarding Department"
 * Scope: Global   Category: Offboarding
 *
 * Replaces the department lookup at the top of the legacy script.
 *
 * Inputs (all String — pass the Sys ID pill, not the record):
 *   user_sys_id          sys_user sys_id of the person being offboarded (optional)
 *   requested_item_sys_id  sc_req_item sys_id (required)
 *
 * Outputs:
 *   department_sys_id    String  cmn_department sys_id, '' if none found
 *   source               String  'user' | 'variable' | 'none'
 *
 * Fixes vs legacy:
 *   - varsGr.variables.department returned a GlideElement, not a string, so
 *     the "==" comparisons only worked by coercion. Always returns a string now.
 *   - Uses get() instead of query()/next() for a single sys_id.
 */
(function execute(inputs, outputs) {
    outputs.department_sys_id = '';
    outputs.source = 'none';

    var userId = (inputs.user_sys_id || '') + '';
    if (userId) {
        var user = new GlideRecord('sys_user');
        if (user.get(userId) && user.getValue('department')) {
            outputs.department_sys_id = user.getValue('department');
            outputs.source = 'user';
            return;
        }
    }

    var ritmId = (inputs.requested_item_sys_id || '') + '';
    if (ritmId) {
        var ritm = new GlideRecord('sc_req_item');
        if (ritm.get(ritmId) && ritm.variables.department) {
            var dept = ritm.variables.department.toString();
            if (dept) {
                outputs.department_sys_id = dept;
                outputs.source = 'variable';
                return;
            }
        }
    }

    gs.warn('[Offboarding] No department found for RITM ' + ritmId + ' / user ' + userId +
        '. Only "All departments" routes (e.g. Service Desk II) will apply.');
})(inputs, outputs);
