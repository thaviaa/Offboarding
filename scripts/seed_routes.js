/**
 * Background script: seed u_offboarding_task_route from the legacy if-blocks.
 *
 * - Safe to re-run: matches existing rows on assignment group and updates them.
 * - Prints the real department / group / template names so you can check the
 *   sys_ids against the comments in the legacy script.
 * - Set DRY_RUN = false to write. Make your story update set current first,
 *   then run scripts/add_records_to_update_set.js to capture the rows.
 */
var DRY_RUN = true;

var DEFAULT_SD = 'OFFBOARDING: Employee/Non-Employee - Remove Access';

var ROUTES = [
    { order: 100, name: 'CAO Support', group: '87329e3c97fb9550cc467d021153af93',
      depts: ['d078c76e97e02510cc467d021153afa4', '1078c76e97e02510cc467d021153afa7', '1c78c76e97e02510cc467d021153afb4'],
      template: 'CAO Support Applications (Offboarding)', active: true },
    { order: 200, name: 'ITS Apps Finance', group: '0332deb09773995030aab2a3f153af04',
      depts: ['1478c76e97e02510cc467d021153afa6', '9078c76e97e02510cc467d021153afa5'],
      template: 'Finance Support Applications (Offboarding)', active: false },
    { order: 300, name: 'ITS Apps DevOps', group: 'cb329eb09773995030aab2a3f153af17',
      depts: ['1c78c76e97e02510cc467d021153afa4', '1478c76e97e02510cc467d021153afa6', 'd078c76e97e02510cc467d021153afa7'],
      template: 'DevOps Support Applications (Offboarding)', active: true },
    { order: 400, name: 'ITS Apps HHS Analyst', group: '8f32deb09773995030aab2a3f153af1c',
      depts: ['1c78c76e97e02510cc467d021153afa4', '1478c76e97e02510cc467d021153afa6', 'd078c76e97e02510cc467d021153afa7'],
      template: 'HHS Analyst Support Applications (Offboarding)', active: true },
    { order: 500, name: 'ITS Apps LUESA and Library', group: '83329eb09773995030aab2a3f153afeb',
      depts: ['1478c76e97e02510cc467d021153afa6', '1078c76e97e02510cc467d021153afa7'],
      template: 'LUESA and Library Support Applications (Offboarding)', active: true },
    { order: 600, name: 'PRK Support', group: '8f329eb09773995030aab2a3f153af55',
      depts: ['9478c76e97e02510cc467d021153afa7', '9c78c76e97e02510cc467d021153afa5', '1c78c76e97e02510cc467d021153afa7',
              'd478c76e97e02510cc467d021153afa6', '5478c76e97e02510cc467d021153afa5'],
      template: 'PRK Support Applications (Offboarding)', active: true },
    { order: 900, name: 'Service Desk II', group: 'cf329eb09773995030aab2a3f153afac',
      all: true, depts: [],
      template: 'Service Desk II Support Applications (Offboarding)', active: true }
];

function nameOf(table, id) {
    var gr = new GlideRecord(table);
    return gr.get(id) ? gr.getDisplayValue() : '!! NOT FOUND !!';
}

ROUTES.forEach(function (r) {
    var tpl = new GlideRecord('checklist_template');
    var tplId = tpl.get('name', r.template) ? tpl.getUniqueValue() : '';

    gs.info('--- ' + r.order + ' ' + r.name + (r.active ? '' : ' (INACTIVE)'));
    gs.info('    group:    ' + nameOf('sys_user_group', r.group));
    gs.info('    template: ' + (tplId ? r.template : '!! NOT FOUND: ' + r.template));
    if (r.all) gs.info('    depts:    ALL');
    r.depts.forEach(function (d) { gs.info('    dept:     ' + d + ' = ' + nameOf('cmn_department', d)); });

    if (DRY_RUN) return;

    var row = new GlideRecord('u_offboarding_task_route');
    var isNew = !row.get('u_assignment_group', r.group);
    if (isNew) row.initialize();
    row.setValue('u_name', r.name);
    row.setValue('u_order', r.order);
    row.setValue('u_active', r.active);
    row.setValue('u_assignment_group', r.group);
    row.setValue('u_all_departments', !!r.all);
    row.setValue('u_departments', r.depts.join(','));
    row.setValue('u_checklist_template', tplId);
    row.setValue('u_short_description', DEFAULT_SD);
    var id = isNew ? row.insert() : (row.update(), row.getUniqueValue());
    gs.info('    ' + (isNew ? 'INSERTED ' : 'UPDATED ') + id);
});

gs.info(DRY_RUN ? 'DRY RUN — nothing written. Set DRY_RUN = false to seed.' : 'Seed complete.');
