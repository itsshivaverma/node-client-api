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
var assert = require('assert');
var should = require('should');

var t = require('../lib/values-builder.js');

describe('values query', function(){
  describe('with value builder', function(){
    it('should build a from indexes clause', function(){
      var built = t.fromIndexes(
          'property1',
          t.property('property2'),
          t.element('element1'),
          t.range('property3'),
          t.range(t.property('property4')),
          t.collection(),
          t.field('field1'),
          t.uri(),
          t.geoElementPair('parent', 'latitude', 'longitude')
      );
      built.should.have.property('fromIndexesClause');
      built.fromIndexesClause.should.have.property('range');
      built.fromIndexesClause.range.length.should.equal(5);
      built.fromIndexesClause.range[0].should.have.property('json-property');
      built.fromIndexesClause.range[0]['json-property'].should.equal('property1');
      built.fromIndexesClause.range[1].should.have.property('json-property');
      built.fromIndexesClause.range[1]['json-property'].should.equal('property2');
      built.fromIndexesClause.range[2].should.have.property('element');
      built.fromIndexesClause.range[2].element.should.have.property('name');
      built.fromIndexesClause.range[2].element.name.should.equal('element1');
      built.fromIndexesClause.range[3].should.have.property('json-property');
      built.fromIndexesClause.range[3]['json-property'].should.equal('property3');
      built.fromIndexesClause.range[4].should.have.property('json-property');
      built.fromIndexesClause.range[4]['json-property'].should.equal('property4');
      built.fromIndexesClause.should.have.property('collection');
      built.fromIndexesClause.should.have.property('field');
      built.fromIndexesClause.field.length.should.equal(1);
      built.fromIndexesClause.field[0].should.equal('field1');
      built.fromIndexesClause.should.have.property('uri');
      built.fromIndexesClause.should.have.property('geospatial');
      built.fromIndexesClause.geospatial.length.should.equal(1);
      built.fromIndexesClause.geospatial[0].should.have.property('geo-elem-pair');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].should.have.property('parent');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].parent.should.have.property('name');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].parent.name.should.equal('parent');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].should.have.property('lat');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].lat.should.have.property('name');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].lat.name.should.equal('latitude');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].should.have.property('lon');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].lon.should.have.property('name');
      built.fromIndexesClause.geospatial[0]['geo-elem-pair'].lon.name.should.equal('longitude');
    });
    it('should build a where clause', function(){
      var built = t.fromIndexes('property1').
      where(
          t.value('key1', 'value 1')
      );
      built.should.have.property('fromIndexesClause');
      built.fromIndexesClause.should.have.property('range');
      built.fromIndexesClause.range.length.should.equal(1);
      built.fromIndexesClause.range[0].should.have.property('json-property');
      built.fromIndexesClause.range[0]['json-property'].should.equal('property1');
      built.should.have.property('whereClause');
      built.whereClause.should.have.property('query');
      built.whereClause.query.should.have.property('queries');
      built.whereClause.query.queries.length.should.equal(1);
      built.whereClause.query.queries[0].should.have.property('value-query');
    });
    it('should build an aggregates clause', function(){
      var built = t.fromIndexes('property1').
      aggregates('avg', 'sum', t.udf('plugin1', 'function1'));
      built.should.have.property('fromIndexesClause');
      built.fromIndexesClause.should.have.property('range');
      built.fromIndexesClause.range.length.should.equal(1);
      built.fromIndexesClause.range[0].should.have.property('json-property');
      built.fromIndexesClause.range[0]['json-property'].should.equal('property1');
      built.should.have.property('aggregatesClause');
      built.aggregatesClause.should.have.property('aggregates');
      built.aggregatesClause.aggregates.length.should.equal(3);
      built.aggregatesClause.aggregates[0].should.have.property('apply');
      built.aggregatesClause.aggregates[0].apply.should.equal('avg');
      built.aggregatesClause.aggregates[1].should.have.property('apply');
      built.aggregatesClause.aggregates[1].apply.should.equal('sum');
      built.aggregatesClause.aggregates[2].should.have.property('apply');
      built.aggregatesClause.aggregates[2].apply.should.equal('function1');
      built.aggregatesClause.aggregates[2].should.have.property('udf');
      built.aggregatesClause.aggregates[2].udf.should.equal('plugin1');
    });
    it('should build a slice clause with start page and page length', function(){
      var built = t.fromIndexes('property1').
      slice(11, 10);
      built.should.have.property('fromIndexesClause');
      built.fromIndexesClause.should.have.property('range');
      built.fromIndexesClause.range.length.should.equal(1);
      built.fromIndexesClause.range[0].should.have.property('json-property');
      built.fromIndexesClause.range[0]['json-property'].should.equal('property1');
      built.should.have.property('sliceClause');
      built.sliceClause['page-start'].should.equal(11);
      built.sliceClause['page-length'].should.equal(10);
    });
    it('should build a slice clause with start page', function(){
      var built = t.fromIndexes('property1').
      slice(11);
      built.should.have.property('fromIndexesClause');
      built.fromIndexesClause.should.have.property('range');
      built.fromIndexesClause.range.length.should.equal(1);
      built.fromIndexesClause.range[0].should.have.property('json-property');
      built.fromIndexesClause.range[0]['json-property'].should.equal('property1');
      built.should.have.property('sliceClause');
      built.sliceClause['page-start'].should.equal(11);
    });
    it('should build a with options clause', function(){
      var built = t.fromIndexes('property1').
      withOptions({values: ['proximity=5']});
      built.should.have.property('fromIndexesClause');
      built.fromIndexesClause.should.have.property('range');
      built.fromIndexesClause.range.length.should.equal(1);
      built.fromIndexesClause.range[0].should.have.property('json-property');
      built.fromIndexesClause.range[0]['json-property'].should.equal('property1');
      built.should.have.property('withOptionsClause');
      built.withOptionsClause.should.have.property('values');
      built.withOptionsClause.values.length.should.equal(1);
      built.withOptionsClause.values[0].should.equal('proximity=5');
    });
  });
});
