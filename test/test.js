/*jshint mocha:true*/
"use strict";

var chai = require('chai');
var expect = chai.expect;
var Record = require('../MarcRecord.js');

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
				"LDR    leader",
				"001    28474",
				"100 __ ‡aTest Author",
				"245 0_ ‡aTest Title",
				"500 #_ ‡aNote",
			].join("\n");

			expect(rec.toString()).to.equal(compareRec);
		});
	});
});
