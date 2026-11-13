/**
 * Background script: force data records into the CURRENT update set.
 * Checklist templates and route rows are data, so update sets don't capture them on their own.
 *
 * 1. Make your story update set current (banner must NOT say Default).
 * 2. Edit RECORDS below and run.
 * 3. Re-run after every later edit — it captures the record as it is now.
 */
var RECORDS = [
    // Story 270088
    { table: 'checklist_template', query: 'name=Service Desk II Support Applications (Offboarding)' }

    // Refactor — uncomment once the route table is seeded
    // ,{ table: 'u_offboarding_task_route', query: '' }   // '' = all rows
];

var um = new GlideUpdateManager2();
RECORDS.forEach(function (spec) {
    var gr = new GlideRecord(spec.table);
    if (spec.query) gr.addEncodedQuery(spec.query);
    gr.query();
    var n = 0;
    while (gr.next()) {
        um.saveRecord(gr);
        n++;
        gs.info('Captured ' + spec.table + ' ' + gr.getUniqueValue() + ' (' + gr.getDisplayValue() + ')');
    }
    if (!n) gs.warn('Nothing matched: ' + spec.table + ' ' + spec.query);
});
