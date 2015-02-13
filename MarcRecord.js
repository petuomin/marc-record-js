/* jshint node:true */
"use strict";

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

function Record(rec) {

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

  	this.appendControlField = function(fieldDef) {
  		if (isArray(fieldDef)) {
			if (fieldDef.length != 2) {
				throw new Error("Control field array must contain exactly 2 elements: [tag, value]");
			}
  			this.appendControlField({
  				tag: fieldDef[0],
  				value: fieldDef[1]
  			});

  		} else {
  			if (typeof fieldDef.tag !== "string") {
				throw new Error("Tag must be string type, not " + typeof fieldDef.tag);
			}
  			this.fields.push(fieldDef);
  		}
  	};
	this.appendField = function(fieldDef) {
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

			this.appendField({
				tag: tag,
				ind1: ind1,
				ind2: ind2,
				subfields: subfields
			});

		} else {
			if (typeof fieldDef.tag !== "string") {
				throw new Error("Tag must be string type, not " + typeof fieldDef.tag);
			}

			validateIndicator(fieldDef.ind1);
			validateIndicator(fieldDef.ind2);

			this.fields.push(fieldDef);	
		}
		
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

module.exports = Record;
