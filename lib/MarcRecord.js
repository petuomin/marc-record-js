
/*
{
	leader: "string",
	fields: [
		// For controlfields:
		// format allows multiple controlfields with same tag
		{
			tag: "string",
			value: "string"
		}

		// For data fields
		{
			tag: "string",
			ind1: "char",
			ind2: "char",
			subfields: [
				{
					code: "char"
					value: "string"
				}
			]
		}
	]
}
*/

(function(root, factory) {
	"use strict";
	
	/* istanbul ignore next: umd wrapper */
	if (typeof define === 'function' && define.amd) { // jshint ignore:line
		define([], factory); // jshint ignore:line
	} else if(typeof exports === 'object') {
		module.exports = factory();  // jshint ignore:line
	} else {
		root.MARCRecord = factory();
	}
}(this, function() {
	"use strict";

	function Record(rec) {

		var CONTROL_FIELD_LIST = ["FMT", "001", "002", "003", "004", "005", "006", "007", "008", "009"];

		if (rec !== undefined) {
			this.leader = rec.leader;
			this.fields = JSON.parse(JSON.stringify(rec.fields));
		} else {
			this.leader = '';
			this.fields = [];
		}

		this.get = function(query) {
		    return this.fields.filter(function(field) {
		    	return field.tag.match(query);
		    });
	  	};

	  	this.setLeader = function(newLeader) {
	  		this.leader = newLeader;
	  	};

	  	this.appendControlField = function(fieldDef) {
	  		this.insertControlField(fieldDef, this.fields.length);
	  	};

	  	this.insertControlField = function(fieldDef, index) {
			if (isArray(fieldDef)) {
				if (fieldDef.length != 2) {
					throw new Error("Control field array must contain exactly 2 elements: [tag, value]");
				}
	  			this.insertControlField({
	  				tag: fieldDef[0],
	  				value: fieldDef[1]
	  			}, index);

	  		} else {
	  			if (typeof fieldDef.tag !== "string") {
					throw new Error("Tag must be string type, not " + typeof fieldDef.tag);
				}
				if (index === undefined) {
					index = this.findPosition(fieldDef.tag);
				}
	  			this.fields.splice(index, 0, fieldDef);
	  		}
	  	};

		this.appendField = function(fieldDef) {
			this.insertField(fieldDef, this.fields.length);
	  	};
	  	this.insertField = function(fieldDef, index) {
	  	
			if (isArray(fieldDef)) {
				if (fieldDef.length < 5) {
					throw new Error("Data field array must contain at least 5 elements: [tag, i1, i2, subcode1, subvalue1]");
				}
				var tag = fieldDef[0];
				var ind1 = fieldDef[1];
				var ind2 = fieldDef[2];
				var subfields = [];

				var subfieldArray = fieldDef.slice(3);

				if (subfieldArray.length % 2 !== 0) {
					throw new Error("Each subfield must have a code and value");
				}
				while (subfieldArray.length > 0) {
					var subfield = subfieldArray.splice(0,2);
					subfields.push({
						code: subfield[0],
						value: subfield[1]
					});
				}

				this.insertField({
					tag: tag,
					ind1: ind1,
					ind2: ind2,
					subfields: subfields
				}, index);

			} else {
				if (typeof fieldDef.tag !== "string") {
					throw new Error("Tag must be string type, not " + typeof fieldDef.tag);
				}

				validateIndicator(fieldDef.ind1);
				validateIndicator(fieldDef.ind2);

				if (index === undefined) {
					index = this.findPosition(fieldDef.tag);
				}

				this.fields.splice(index, 0, fieldDef);
			}
	  	};

	  	this.findPosition = function(tag) {
	  		var i;
	  		for (i=0;i<this.fields.length;i++) {
	  			if (this.fields[i].tag > tag) {
	  				return i;
	  			}
	  		}
	  		return this.fields.length;
	  	};

	  	this.getControlfields = function() {
	  		return this.fields.filter(function(field) {
	  			return CONTROL_FIELD_LIST.indexOf(field.tag) !== -1;
	  		});

	  	};

	  	this.getDatafields = function() {
			return this.fields.filter(function(field) {
	  			return CONTROL_FIELD_LIST.indexOf(field.tag) === -1;
	  		});
	  	};

	  	function validateIndicator(indicator) {
	  		if (indicator === undefined || indicator === null) {
	  			return true;
	  		}

			if (indicator.length > 1) {
				throw new Error("Indicators must be at most 1 characters long.");
			}

			return true;
	  	}

	  	this.toString = function() {
	  		var controlFieldLines = [];
	  		var dataFieldLines = [];
	  		controlFieldLines.push(["LDR", this.leader]);
	  		this.fields.forEach(function(field) {
	  			if (isControlField(field)) {
	  				controlFieldLines.push([field.tag, field.value]);
	  			} else {
	  				var subfieldDataArray = field.subfields.map(function(subfield) {
	  					return subfield.code + subfield.value;
	  				});

					dataFieldLines.push([field.tag, field.ind1, field.ind2, subfieldDataArray]);
	  			}
	  		});

	  		var lines = [
	  			controlFieldLines.map(controlFieldStringFormatter).join("\n"),
	  			dataFieldLines.map(dataFieldStringFormatter).join("\n")
	  		];

	  		return lines.join("\n");

	  	};

  		this.toJsonObject = function() {
	    	return {
				leader: this.leader,
				fields: JSON.parse(JSON.stringify(this.fields))
		    };
	  	};

	  	function controlFieldStringFormatter(controlFieldArray) {
	  		return controlFieldArray[0] + "    " + controlFieldArray[1];
	  	}

	  	function dataFieldStringFormatter(dataFieldArray) {
	  		var subfieldMarker = "‡";

	  		var indicatorsString = "";
	  		indicatorsString += indicatorStringFormatter(dataFieldArray[1]);
	  		indicatorsString += indicatorStringFormatter(dataFieldArray[2]);

	  		return dataFieldArray[0] + " "+indicatorsString+" " + subfieldMarker + dataFieldArray[3].join(subfieldMarker);
	  	}

	  	function indicatorStringFormatter(indicator) {
	  		if (indicator === undefined || indicator === null) {
	  			return "_";
	  		}
	  		if (indicator.length === 0) {
	  			return "_";
	  		}
	  		return indicator;

	  	}

	  	function isControlField(field) {
	  		return (field.tag !== undefined && field.value !== undefined);
	  	}

	  	function isArray(value) {
	  		return Object.prototype.toString.call( value ) === '[object Array]';
	  	}

	}

	Record.fromString = function(stringRep) {

		var rec = new Record();

		var fields = stringRep.split("\n");

		fields.forEach(function(fieldLine) {

			var tag = fieldLine.substr(0,3);
			var ind1 = fieldLine.substr(4,1);
			var ind2 = fieldLine.substr(5,1);
			var data = fieldLine.substr(7);

			if (tag == "LDR") {
				rec.setLeader(data);
			} else {

				if (data.substr(0,1) !== "‡") {
					//controlfield
					rec.appendControlField([tag, data]);

				} else {
					var subfieldArray = data.substr(1).split("‡").map(function(codeAndValue) { 
						return [codeAndValue.substr(0,1), codeAndValue.substr(1)]; 
					});

					var flattened = Array.prototype.concat.apply([], subfieldArray);

					rec.appendField([tag,ind1,ind2].concat(flattened));

				}
			}


		});

		return rec;

	};

	return Record;
}));
