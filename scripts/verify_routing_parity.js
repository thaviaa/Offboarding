/**
 * Background script: prove the route table creates the same tasks as the
 * legacy if-blocks, for every department (plus "no department").
 *
 * Read-only. Run after seeding, before switching the flow over.
 * Expect: "PARITY OK" — any MISMATCH line is a department whose tasks would change.
 */
function legacyGroups(dept) {
    var g = [];
    if (dept == 'd078c76e97e02510cc467d021153afa4' || dept == '1078c76e97e02510cc467d021153afa7' || dept == '1c78c76e97e02510cc467d021153afb4')
        g.push('87329e3c97fb9550cc467d021153af93'); // CAO
    // Finance block is commented out in legacy
    if (dept == '1c78c76e97e02510cc467d021153afa4' || dept == '1478c76e97e02510cc467d021153afa6' || dept == 'd078c76e97e02510cc467d021153afa7') {
        g.push('cb329eb09773995030aab2a3f153af17'); // DevOps
        g.push('8f32deb09773995030aab2a3f153af1c'); // HHS Analyst
    }
    if (dept == '1478c76e97e02510cc467d021153afa6' || dept == '1078c76e97e02510cc467d021153afa7')
        g.push('83329eb09773995030aab2a3f153afeb'); // LUESA & Library
    if (dept == '9478c76e97e02510cc467d021153afa7' || dept == '9c78c76e97e02510cc467d021153afa5' || dept == '1c78c76e97e02510cc467d021153afa7' ||
        dept == 'd478c76e97e02510cc467d021153afa6' || dept == '5478c76e97e02510cc467d021153afa5')
        g.push('8f329eb09773995030aab2a3f153af55'); // PRK
    g.push('cf329eb09773995030aab2a3f153afac'); // Service Desk II — always
    return g;
}

// Same query the subflow's Look Up Records step uses.
function routeGroups(dept) {
    var g = [];
    var r = new GlideRecord('u_offboarding_task_route');
    var q = 'u_active=true^u_all_departments=true';
    if (dept) q += '^ORu_departmentsLIKE' + dept;
    r.addEncodedQuery(q);
    r.orderBy('u_order');
    r.query();
    while (r.next()) g.push(r.getValue('u_assignment_group'));
    return g;
}

var depts = [''];
var d = new GlideRecord('cmn_department');
d.query();
while (d.next()) depts.push(d.getUniqueValue());

var mismatches = 0;
depts.forEach(function (id) {
    var a = legacyGroups(id).join(',');
    var b = routeGroups(id).join(',');
    if (a !== b) {
        mismatches++;
        var name = id ? (d.get(id) ? d.getDisplayValue() : id) : '(no department)';
        gs.info('MISMATCH ' + name + '\n  legacy: ' + a + '\n  routes: ' + b);
    }
});
gs.info(mismatches ? mismatches + ' MISMATCH(ES) across ' + depts.length + ' departments'
                   : 'PARITY OK across ' + depts.length + ' departments');
