/**
 * CURRENT (legacy) script step — "Application Tasks to Support Groups"
 * Flow: Software flow(Offboarding), step 2
 *
 * Kept here as the baseline for the refactor. Copied from the instance as-is;
 * only the line wrapping introduced by the PDF export was repaired.
 * Do NOT deploy this file — see ../actions and ../docs/subflow-design.md.
 */
(function execute(inputs, outputs) {

    //get the user department
    var dept;
    if (inputs.user.department.sys_id) {
        dept = inputs.user.department.sys_id;
    } else {
        var varsGr = new GlideRecord('sc_req_item');
        varsGr.addQuery('sys_id', inputs.currentRITM);
        varsGr.query();
        if (varsGr.next()) {
            dept = varsGr.variables.department;
        }
    }
    //initialize template and assignment group (ag) vars
    var template;
    var ag;
    //set variables that should be on each catalog task from application access offboard cat item
    var vars = 'requested_for,supervisor_name,email_address,telephone_number,vs_effective_date';

    //cao support group if dept is County Assessor's Office, Land Use and Environmental Services Agency, or Office of the Tax Collector
    if (dept == 'd078c76e97e02510cc467d021153afa4' || dept == '1078c76e97e02510cc467d021153afa7' || dept == '1c78c76e97e02510cc467d021153afb4') {
        //create sc_task to cao support assignment group
        ag = '87329e3c97fb9550cc467d021153af93'; //CAO Support assignment group
        var scTaskCAO = this.createRecord(ag, inputs.currentRITM);
        this.addVariables(scTaskCAO, vars);
        template = this.getTemplate('CAO Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
        this.generateChecklist(template, scTaskCAO);
    }

    //its apps finance if dept is Public Health Department or Department of Social Services
    //if (dept == '1478c76e97e02510cc467d021153afa6' || dept == '9078c76e97e02510cc467d021153afa5') {
    //      //create sc_task to finance support assignment group
    //      ag = '0332deb09773995030aab2a3f153af04'; //ITS Apps Finance assignment group
    //      var scTaskFinance = this.createRecord(ag, inputs.currentRITM);
    //      this.addVariables(scTaskFinance, vars);
    //      template = this.getTemplate('Finance Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
    //      this.generateChecklist(template, scTaskFinance);
    //}

    //its Apps DevOps and its apps HHS Analyst if dept is Community Support Services, Public Health Department, or Medical Examiner's Office
    if (dept == '1c78c76e97e02510cc467d021153afa4' || dept == '1478c76e97e02510cc467d021153afa6' || dept == 'd078c76e97e02510cc467d021153afa7') {
        //create sc_task to its apps devops assignment group
        ag = 'cb329eb09773995030aab2a3f153af17'; //ITS Apps DevOps assignment group
        var scTaskDevOps = this.createRecord(ag, inputs.currentRITM);
        this.addVariables(scTaskDevOps, vars);
        template = this.getTemplate('DevOps Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
        this.generateChecklist(template, scTaskDevOps);

        //create sc_task to HHS Analyst support assignment group
        ag = '8f32deb09773995030aab2a3f153af1c'; //ITS Apps HHS Analyst assignment group
        var scTaskHHSAnalyst = this.createRecord(ag, inputs.currentRITM);
        this.addVariables(scTaskHHSAnalyst, vars);
        template = this.getTemplate('HHS Analyst Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
        this.generateChecklist(template, scTaskHHSAnalyst);
    }

    //its apps luesa and library if dept is Public Health Department or Land Use and Environmental Services Agency
    if (dept == '1478c76e97e02510cc467d021153afa6' || dept == '1078c76e97e02510cc467d021153afa7') {
        //create sc_task to luesa and library support assignment group
        ag = '83329eb09773995030aab2a3f153afeb'; //ITS Apps LUESA and Library assignment group
        var scTaskLUESA = this.createRecord(ag, inputs.currentRITM);
        this.addVariables(scTaskLUESA, vars);
        template = this.getTemplate('LUESA and Library Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
        this.generateChecklist(template, scTaskLUESA);
    }

    //its park support if dept is County Manager's Office, Financial Services, Park & Recreation, Human Resources Department, or Office of Economic Development
    if (dept == '9478c76e97e02510cc467d021153afa7' || dept == '9c78c76e97e02510cc467d021153afa5' || dept == '1c78c76e97e02510cc467d021153afa7' || dept == 'd478c76e97e02510cc467d021153afa6' || dept == '5478c76e97e02510cc467d021153afa5') {
        //create sc_task to park support assignment group
        ag = '8f329eb09773995030aab2a3f153af55'; //PRK Support assignment group
        var scTaskPark = this.createRecord(ag, inputs.currentRITM);
        this.addVariables(scTaskPark, vars);
        template = this.getTemplate('PRK Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
        this.generateChecklist(template, scTaskPark);
    }

    //its service desk II if dept is anything
    //this should always happen
    //create sc_task to service desk II support assignment group
    ag = 'cf329eb09773995030aab2a3f153afac'; //ITS Service Desk II assignment group
    var scTaskSD = this.createRecord(ag, inputs.currentRITM);
    this.addVariables(scTaskSD, vars);
    template = this.getTemplate('Service Desk II Support Applications (Offboarding)'); //PUT YOUR CHECKLIST NAME HERE
    this.generateChecklist(template, scTaskSD);

})(inputs, outputs);

function addVariables(taskID, vars) {
    //taskID pass the ID of the catalog task, created via createRecord function
    //vars, comma seperated string with the names of the variables you want to add to a task

    //Query to add Variables as well as Variable Sets
    var getVar = new GlideRecord('item_option_new');
    var queryStr = 'nameIN' + vars + '^variable_set=e420534897b1e11064a937671153afca^ORvariable_set=751c557d97379150500675611153afed^ORvariable_set=1e31bb6093381a10af8c39ddfaba10f9';
    getVar.addEncodedQuery(queryStr);
    getVar.query();

    //For each variable, create an associated record in sc_item_variables_task
    while (getVar.next()) {
        var setVar = new GlideRecord('sc_item_variables_task');
        setVar.initialize();
        setVar.task = taskID;
        setVar.variable = getVar.getValue('sys_id');
        setVar.update();
    }
}

//create checklist from template and add to current scTask
function generateChecklist(template, task) {
    var table = 'sc_task';
    var json = new global.JSON();
    var itemJSON = json.decode(template);
    var name = itemJSON['name'];
    var items = itemJSON['items'];
    var owner = itemJSON['owner'];
    var checklistId = '';

    var grList = new GlideRecord('checklist');
    grList.addQuery('document', task + '');
    grList.addQuery('table', table);
    grList.query();
    if (!grList.next()) {
        grList.document = task + '';
        grList.name = name;
        grList.owner = owner;
        grList.table = table;
        checklistId = grList.insert();

        for (var i = 0; i < items.length; i++) {
            var grItem = new GlideRecord('checklist_item');
            grItem.checklist = checklistId;
            grItem.complete = false;
            grItem.name = items[i]['name'];
            grItem.order = items[i]['order'];
            grItem.insert();
        }
    }
}

//get checklist template by name that has been preconfigured
function getTemplate(name) {
    var grTemplate = new GlideRecord('checklist_template');
    grTemplate.get('name', name);
    return grTemplate.template;
}

//create appropriate sc_task for the current scenario
function createRecord(group, currRitm) {
    var taskGr = new GlideRecord('sc_task');
    taskGr.initialize();
    taskGr.request_item = currRitm;
    taskGr.assignment_group = group;
    taskGr.short_description = 'OFFBOARDING: Employee/Non-Employee - Remove Access';
    return taskGr.insert();
}
