/*jshint mocha:true*/
'use strict';

var chai = require('chai');
var expect = chai.expect;
var Record = require('../lib/MarcRecord.js');

describe('Record', function() {

  describe('appendControlField', function() {

    var rec = new Record();

    it('should append control fields to the record', function() {
      rec.appendControlField({tag: '008', value: 'testvalue'});
      expect(rec.get('008')).length.to.be(1);

      expect(rec.get('008')[0].tag).to.equal('008');
      expect(rec.get('008')[0].value).to.equal('testvalue');

    });

    it('should append control fields to the record in array format', function() {
      rec.appendControlField(['001', '002312312']);

      expect(rec.get('001')).length.to.be(1);

      expect(rec.get('001')[0].value).to.equal('002312312');

    });

    it('should throw error if number of items is not valid for control field', function() {
      function tryAppendingDatafieldDataUsingControlfieldFunction() {
        rec.appendControlField(['500', '0', '', 'a', 'Note']);
      }

      expect( tryAppendingDatafieldDataUsingControlfieldFunction ).to.throw(Error);

    });

    it('should throw error if the tag is not a string type', function() {

      function appendNumberTypeTag() {
        rec.appendControlField([1, '0234089234234']);
      }

      expect( appendNumberTypeTag ).to.throw(Error);

    });

  });

  describe('appendField', function() {

    var rec = new Record();

    it('should append data fields to the record', function() {
      rec.appendField({
        tag: '100',
        ind1: ' ',
        ind2: ' ',
        subfields: [
          {code:'a', value: 'Test Author'}
        ]
      });


      expect(rec.get('100')).length.to.be(1);

      expect(rec.get('100')[0].tag).to.equal('100');
      expect(rec.get('100')[0].subfields[0].value).to.equal('Test Author');

    });

    it('should append data fields to the record in array format', function() {
      rec.appendField(['245', '0', '', 'a', 'Test Title']);

      expect(rec.get('245')).length.to.be(1);

      expect(rec.get('245')[0].tag).to.equal('245');
      expect(rec.get('245')[0].ind1).to.equal('0');
      expect(rec.get('245')[0].subfields[0].value).to.equal('Test Title');

    });

    it('should throw error if number of items is not valid for data field', function() {
      function tryAppendingControlfieldDataUsingDatafieldFunction() {
        rec.appendField(['001', '002312312']);
      }

      expect( tryAppendingControlfieldDataUsingDatafieldFunction ).to.throw(Error);

    });

    it('should throw error if the tag is not a string type', function() {

      function appendNumberTypeTag() {
        rec.appendField([500, '0', '', 'a', 'Note']);
      }

      expect( appendNumberTypeTag ).to.throw(Error);

    });

    it('should throw error if the array data is malformed', function() {

      function appendFieldWithNoElementForSubfieldBValue() {
        rec.appendField(['500', '0', '', 'a', 'Note', 'b']);
      }

      expect( appendFieldWithNoElementForSubfieldBValue ).to.throw(Error);

    });

    it('should throw error if the indicators are not formatted correctly', function() {

      function appendFieldWithIndicatorOfLengthTwo() {
        rec.appendField(['500', '00', '', 'a', 'Note']);
      }

      expect( appendFieldWithIndicatorOfLengthTwo ).to.throw(Error);

    });

  });

  describe('removeField', function() {
    it('Should remove a field from the record', function() {
      var recordObject = {
        fields: [{ tag: '001', value: 'foo'}, {tag: '005', value: 'bar'}]
      };
      var record = new Record(JSON.parse(JSON.stringify(recordObject)));

      record.removeField(record.fields[1]);
      expect(record.get()).to.eql([{tag: '001', value: 'foo'}]);
    });
  });

  describe('constructor', function() {

    it('should make a deep copy of the argument object', function() {

      var testRecordDataObject = {
        leader: 'leader',
        fields: [{
          tag: '001',
          value: '28474'
        }]
      };

      var rec = new Record( testRecordDataObject );
      rec.appendField(['500', '0', '', 'a', 'Note']);

      expect(testRecordDataObject.fields).length.to.be(1);
      expect(rec.fields).length.to.be(2);

    });
  });

  describe('getControlfields', function() {


    it('should return controlfields and only controlfields', function() {


      var rec = new Record();
      rec.appendControlField(['001', '98234240']);
      rec.appendControlField(['008', 'field008']);

      rec.appendField(['500', '0', '', 'a', 'Note']);

      expect(rec.getControlfields()).length.to.be(2);

    });


  });

  describe('getDatafields', function() {

    it('should return only datafields', function() {


      var rec = new Record();
      rec.appendControlField(['001', '98234240']);
      rec.appendControlField(['008', 'field008']);

      rec.appendField(['500', '0', '', 'a', 'Note']);

      expect(rec.getDatafields()).length.to.be(1);

    });

  });

  describe('insertField', function() {

    it('should insert field into the correct location', function() {

      var rec = new Record();
      rec.appendControlField(['001', '98234240']);
      rec.appendControlField(['008', 'field008']);

      rec.appendField(['500', '0', '', 'a', 'Note']);
      rec.insertField(['245', '0', '', 'a', 'Note']);

      expect(rec.fields.map(toTag).join()).to.equal(['001','008','245','500'].join());

    });

    function toTag(field) {
      return field.tag;
    }

  });

  describe('insertField', function() {

    it('should append field into the end if its the correct location', function() {

      var rec = new Record();
      rec.appendControlField(['001', '98234240']);
      rec.appendControlField(['008', 'field008']);

      rec.appendField(['500', '0', '', 'a', 'Note']);
      rec.insertField(['600', '0', '', 'a', 'Note']);

      expect(rec.fields.map(toTag).join()).to.equal(['001','008','500','600'].join());

    });

    function toTag(field) {
      return field.tag;
    }

  });

  describe('insertControlField', function() {

    it('should insert controlfield into the correct location', function() {

      var rec = new Record();
      rec.appendControlField(['001', '98234240']);
      rec.appendControlField(['008', 'field008']);

      rec.appendField(['500', '0', '', 'a', 'Note']);
      rec.insertControlField(['005', 'timestamp']);

      expect(rec.fields.map(toTag).join()).to.equal(['001','005', '008','500'].join());

    });

    function toTag(field) {
      return field.tag;
    }

  });


  describe('toString', function() {
    it('should generate human readable MARC string', function() {

      var testDataObject = {
        leader: 'leader',
        fields: [{
          tag: '001',
          value: '28474'
        }]
      };
      var rec = new Record( testDataObject );

      rec.appendField(['100', undefined, '', 'a', 'Test Author']);
      rec.appendField(['245', '0', null, 'a', 'Test Title']);
      rec.appendField(['500', '#', '', 'a', 'Note']);

      var compareRec = [
        'LDR    leader',
        '001    28474',
        '100    ‡aTest Author',
        '245 0  ‡aTest Title',
        '500 #  ‡aNote',
      ].join('\n');

      expect(rec.toString()).to.equal(compareRec);
    });
  });

  describe('fromString', function() {
    it('should create proper record from string generated by toString()', function() {
      var testDataObject = {
        leader: 'leader',
        fields: [{
          tag: '001',
          value: '28474'
        }]
      };
      var rec = new Record( testDataObject );

      rec.appendField(['100', undefined, '', 'a', 'Test Author']);
      rec.appendField(['245', '0', null, 'a', 'Test Title']);
      rec.appendField(['500', '#', '', 'a', 'Note', 'b', 'Second subfield']);

      var stringRep = [
        'LDR    leader',
        '001    28474',
        '100    ‡aTest Author',
        '245 0  ‡aTest Title',
        '500 #  ‡aNote‡bSecond subfield',
      ].join('\n');


      var parsedRecord = Record.fromString(stringRep);

      expect(parsedRecord.toString()).to.equal(rec.toString());

    });
  });

  describe('toJsonObject', function() {
    it('should generate a plain JSON-serializable object', function() {

      var testDataObject = {
        leader: 'leader',
        fields: [{
          tag: '001',
          value: '28474'
        }]
      };
      var json_str = '{"leader":"leader","fields":[{"tag":"001","value":"28474"}]}';
      var rec = new Record( testDataObject );

      expect(JSON.stringify(rec.toJsonObject())).to.equal(json_str);
    });
  });

  describe('containsFieldWithValue', function() {
    var record = Record.fromString([
      'LDR    leader',
      '001    28474',
      '003    aaabbb',
      '100    ‡aTest Author',
      '245 0  ‡aSome content',
      '245 0  ‡aTest Title‡bTest field‡cTest content',
      'STA    ‡aDELETED'
    ].join('\n'));

    it('throws when called with less than 2 parameters', function() {
      expect(record.containsFieldWithValue.bind(record, '001')).to.throw(Error);
    });

    it('returns true if matching control field is found', function() {
      expect(record.containsFieldWithValue('003', 'aaabbb')).to.equal(true);
    });

    it('returns false if matching control field is not found', function() {
      expect(record.containsFieldWithValue('003', 'aaabbc')).to.equal(false);
    });

    it('returns true if matching subfield of a datafield is found', function() {
      expect(record.containsFieldWithValue('245', 'b', 'Test field')).to.equal(true);
    });

    it('returns true if all subfields are matching', function() {
      expect(record.containsFieldWithValue('245', 'b', 'Test field', 'c', 'Test content')).to.equal(true);
    });

    it('returns true if all subfields are matching in array form', function() {
      expect(record.containsFieldWithValue('245', [
        {code: 'b', value:'Test field' },
        {code: 'c', value: 'Test content'}
      ])).to.equal(true);
    });

    it('returns false if any subfield is not matching', function() {
      expect(record.containsFieldWithValue('245', 'b', 'Test field', 'c', 'not-matching')).to.equal(false);
    });
  });

  describe('getFields', function() {
    var record = Record.fromString([
      'LDR    leader',
      '001    28474',
      '003    aaabbb',
      '100    ‡aTest Author',
      '245    ‡aSome content‡bTest field',
      '245    ‡aTest Title‡bTest field‡cTest content',
      'STA    ‡aDELETED'
    ].join('\n'));

    it('returns array of fields that match the given tag', function() {
      expect(record.getFields('245')).to.eql([
        mkField('245', [['a', 'Some content'], ['b', 'Test field']]),
        mkField('245', [['a', 'Test Title'], ['b', 'Test field'], ['c', 'Test content']]),
      ]);
    });
    it('returns array of fields that match the given tag and any subfield by code and value', function() {

      expect(record.getFields('245', 'b', 'Test field')).to.eql([
        mkField('245', [['a', 'Some content'], ['b', 'Test field']]),
        mkField('245', [['a', 'Test Title'], ['b', 'Test field'], ['c', 'Test content']])
      ]);
    });
    it('returns array of fields that match only the given tag and any subfield by code and value', function() {
      expect(record.getFields('245', 'c', 'Test content')).to.eql([
        mkField('245', [['a', 'Test Title'], ['b', 'Test field'], ['c', 'Test content']]),
      ]);
    });
    it('returns an empty array when no tags match', function() {
      expect(record.getFields('246')).to.eql([]);
    });
    it('returns array of matching control fields', function() {
      expect(record.getFields('003', 'aaabbb')).to.eql([{tag: '003', value:'aaabbb'}]);
    });

  });

  describe('isDeleted', function() {
    var record;
    describe('for a record that contains STA $a DELETED', function() {
      beforeEach(function() {
        record = Record.fromString([
          'LDR    leader',
          '001    28474',
          '100    ‡aTest Author',
          '245 0  ‡aTest Title',
          'STA    ‡aDELETED'
        ].join('\n'));
      });

      it('should return true', function() {
        expect(record.isDeleted()).to.equal(true);
      });
    });

    describe('for a record that contains DEL $a Y', function() {
      beforeEach(function() {
        record = Record.fromString([
          'LDR    leader',
          '001    28474',
          '100    ‡aTest Author',
          '245 0  ‡aTest Title',
          'DEL    ‡aY'
        ].join('\n'));
      });

      it('should return true', function() {
        expect(record.isDeleted()).to.equal(true);
      });
    });

    describe('for a record that contains d in leader/05 (6th character)', function() {
      beforeEach(function() {
        record = Record.fromString([
          'LDR    abcdedghijk',
          '001    28474',
          '100    ‡aTest Author',
          '245 0  ‡aTest Title'
        ].join('\n'));
      });

      it('should return true', function() {
        expect(record.isDeleted()).to.equal(true);
      });
    });

    describe('for a record that is not deleted', function() {
      beforeEach(function() {
        record = Record.fromString([
          'LDR    lead',
          '001    28474',
          '100    ‡aTest Author',
          '245 0  ‡aTest Title',
          '500 #  ‡aNote‡bSecond subfield'
        ].join('\n'));
      });

      it('should return false', function() {
        expect(record.isDeleted()).to.equal(false);
      });
    });
  });

  describe('equalsTo', function() {

    it('should return true when record is compared to itself', function() {
      var recordString = [
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n');

      var record = Record.fromString(recordString);

      expect(record.equalsTo(record)).to.be.true;
    });

    it('should return true if records are equal', function() {
      var recordString = [
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n');

      var record1 = Record.fromString(recordString);
      var record2 = Record.fromString(recordString);

      expect(record1.equalsTo(record2)).to.be.true;
    });

  });

  describe('isEqual', function() {

    it('should return true when record is compared to itself', function() {
      var recordString = [
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n');

      var record = Record.fromString(recordString);

      expect(Record.isEqual(record, record)).to.be.true;
    });

    it('should return true if records are equal', function() {
      var recordString = [
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n');

      var record1 = Record.fromString(recordString);
      var record2 = Record.fromString(recordString);

      expect(Record.isEqual(record1, record2)).to.be.true;

    });

    it('should return false if records have differing data fields', function() {

      var record1 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n'));

      var record2 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author‡cExtra-content'
      ].join('\n'));

      expect(Record.isEqual(record1, record2)).to.be.false;

    });


    it('should return false if records have differing amount of data fields', function() {

      var record1 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n'));

      var record2 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author',
        '245    ‡aTest Title'
      ].join('\n'));

      expect(Record.isEqual(record1, record2)).to.be.false;

    });

    it('should return false if records have differing indicators', function() {

      var record1 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n'));

      var record2 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100 2  ‡aTest Author'
      ].join('\n'));

      expect(Record.isEqual(record1, record2)).to.be.false;

    });

    it('should return false if records have differing control fields', function() {

      var record1 = Record.fromString([
        'LDR    lead',
        '001    284333',
        '100    ‡aTest Author'
      ].join('\n'));

      var record2 = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n'));

      expect(Record.isEqual(record1, record2)).to.be.false;

    });

    it('should return false if records have differing leaders', function() {
      var record1 = Record.fromString([
        'LDR    leader1',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n'));

      var record2 = Record.fromString([
        'LDR    leader2',
        '001    28474',
        '100    ‡aTest Author'
      ].join('\n'));

      expect(Record.isEqual(record1, record2)).to.be.false;
    });

  });

  describe('clone', function() {
    var record;
    beforeEach(function() {
      record = Record.fromString([
        'LDR    lead',
        '001    28474',
        '100    ‡aTest Author',
        '245 0  ‡aTest Title',
        '500 #  ‡aNote‡bSecond subfield'
      ].join('\n'));
    });

    it('should make a deep copy of the record', function() {
      var cloneOfRecord = Record.clone(record);

      expect(cloneOfRecord.equalsTo(record)).to.be.true;
      expect(cloneOfRecord.fields !== record.fields);

    });

  });
});

function mkField(tag, subfields) {
  var field = { ind1: ' ', ind2:' ' };
  field.tag = tag;

  field.subfields = subfields.map(function(pair) {
    return {code: pair[0], value: pair[1]};
  });
  return field;
}
