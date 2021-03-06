'use strict';
// declareUpdate(); // Note: uncomment if changing the database state

var param1; // instanceof xs.int?
const inspector = require('/dbf/test/testInspector.sjs');
const errorList = [];
const funcdef   = {
  "functionName" : "postOfUrlencodedIntForNone1",
  "params" : [ {
    "name" : "param1",
    "datatype" : "int",
    "multiple" : false,
    "nullable" : true
  } ]
};
let fields = {};
fields = inspector.addField(
  '/dbf/test/postOfUrlencodedForNone/postOfUrlencodedIntForNone1', fields, 'param1', param1
  );

fields = inspector.getFields(funcdef, fields, errorList);
inspector.makeResult('/dbf/test/postOfUrlencodedForNone/postOfUrlencodedIntForNone1', funcdef, fields, errorList);
