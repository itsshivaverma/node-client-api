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
var db = require('../').createDatabaseClient({
  host:     'localhost',
  port:     '8004',
  user:     'rest-reader',
  password: 'x',
  authType: 'DIGEST'
});

['/countries/uv.json', '/does/not/exist.json'].
  forEach(function(uri){
    //shortcut for db.documents.check(...)
    db.check(uri).result(function(document) {
        console.log('document at '+uri+' exists: '+document.exists);
        });
    });