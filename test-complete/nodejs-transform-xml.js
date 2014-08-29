/*
 * Copyright 2014 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var should = require('should');
var fs = require('fs');
var concatStream = require('concat-stream');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Extension library test', function(){
  before(function(done){
    this.timeout(3000);
    dbWriter.documents.write({
      uri: '/test/transform/employee.xml',
      collections: ['employee'],
      contentType: 'application/xml',
      content: '<Company><Employee><name>John</name></Employee></Company>' 
    }).
    result(function(response){done();}, done);
  });

  var transformName = 'employeeStylesheet';
  var transformPath = './data/employeeStylesheet.xslt';

  it('should write the transform', function(done){
    this.timeout(3000);
    fs.createReadStream(transformPath).
    pipe(concatStream({encoding: 'string'}, function(source) {
      dbAdmin.config.transforms.write(transformName, 'xslt', source).
      result(function(response){done();}, done);
    }));
  });

  it('should read the transform', function(done){
    dbAdmin.config.transforms.read(transformName).
    result(function(source){
      (!valcheck.isNullOrUndefined(source)).should.equal(true);
      done();
    }, done);
  });
    
  it('should list the transform', function(done){
    dbAdmin.config.transforms.list().
    result(function(response){
      response.should.have.property('transforms');
      done();
    }, done);
  });
  
  var uri = '/test/transform/employee.xml'; 

  it('should modify during read', function(done){
    db.read({
      uris: uri,
      transform: [transformName]
    }).
    result(function(response) {
      console.log(response)
      response[0].content.should.containEql('<firstname>');
      done();
    }, done);
  });

  it('should modify during query', function(done){
    db.query(
      q.where(
        q.collection('employee')
      ).
      withOptions({transform: [transformName]})
    ).
    result(function(response) {
      console.log(response)
      response[0].content.should.containEql('<firstname>');
      done();
    }, done);
  });

});