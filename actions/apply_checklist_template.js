/**
 * Flow Designer Action: "Apply Checklist Template"
 * Scope: Global   Category: Catalog Tasks
 *
 * Creates a checklist on an sc_task from a checklist_template record.
 *
 * Inputs (String):
 *   task_sys_id       sc_task sys_id (required)
 *   template_sys_id   checklist_template sys_id (required)
 *
 * Outputs:
 *   status            String  'created' | 'exists' | 'error'
 *   checklist_sys_id  String
 *   item_count        Integer
 *   message           String  reason when status = 'error'
 *
 * Fixes vs legacy:
 *   - Template is passed by reference (sys_id), not looked up by name, so
 *     renaming a template no longer silently breaks the flow.
 *   - Bad JSON or a missing template returns status 'error' and logs, instead
 *     of throwing and stopping the whole offboarding flow half-way.
 *   - JSON.parse instead of the deprecated global.JSON().decode.
 *   - Items are sorted by order before insert.
 */
(function execute(inputs, outputs) {
    outputs.status = 'error';
    outputs.checklist_sys_id = '';
    outputs.item_count = 0;
    outputs.message = '';

    var taskId = (inputs.task_sys_id || '') + '';
    var templateId = (inputs.template_sys_id || '') + '';
    var TABLE = 'sc_task';

    if (!taskId || !templateId) {
        return fail('Missing task_sys_id or template_sys_id');
    }

    var tpl = new GlideRecord('checklist_template');
    if (!tpl.get(templateId)) {
        return fail('Checklist template not found: ' + templateId);
    }

    var parsed;
    try {
        parsed = JSON.parse(tpl.getValue('template') || '{}');
    } catch (e) {
        return fail('Invalid JSON in checklist template "' + tpl.getValue('name') + '": ' + e);
    }
    var items = (parsed && parsed.items) || [];

    // One checklist per task — same rule as the legacy script.
    var existing = new GlideRecord('checklist');
    existing.addQuery('table', TABLE);
    existing.addQuery('document', taskId);
    existing.setLimit(1);
    existing.query();
    if (existing.next()) {
        outputs.status = 'exists';
        outputs.checklist_sys_id = existing.getUniqueValue();
        return;
    }

    var list = new GlideRecord('checklist');
    list.initialize();
    list.setValue('table', TABLE);
    list.setValue('document', taskId);
    list.setValue('name', parsed.name || tpl.getValue('name'));
    list.setValue('owner', parsed.owner || tpl.getValue('user'));
    var checklistId = list.insert();
    if (!checklistId) {
        return fail('Could not create checklist on task ' + taskId);
    }

    items.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    for (var i = 0; i < items.length; i++) {
        if (!items[i] || !items[i].name) continue;
        var item = new GlideRecord('checklist_item');
        item.initialize();
        item.setValue('checklist', checklistId);
        item.setValue('name', items[i].name);
        item.setValue('order', items[i].order != null ? items[i].order : i);
        item.setValue('complete', false);
        if (item.insert()) outputs.item_count++;
    }

    outputs.status = 'created';
    outputs.checklist_sys_id = checklistId;

    function fail(msg) {
        outputs.status = 'error';
        outputs.message = msg;
        gs.error('[Apply Checklist Template] ' + msg);
    }
})(inputs, outputs);
