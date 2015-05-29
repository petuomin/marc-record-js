# marc-record-js

[![Build Status](https://travis-ci.org/petuomin/marc-record-js.svg?branch=master)](https://travis-ci.org/petuomin/marc-record-js)
[![Code Climate](https://codeclimate.com/github/petuomin/marc-record-js/badges/gpa.svg)](https://codeclimate.com/github/petuomin/marc-record-js)
[![Test Coverage](https://codeclimate.com/github/petuomin/marc-record-js/badges/coverage.svg)](https://codeclimate.com/github/petuomin/marc-record-js/coverage)

MARC record implementation in javascript

## Installation


```

npm install marc-record-js

```


## Usage

The tests contains multiple examples on how to use the module.

```

var Record = require('marc-record-js');

// Create empty record
var myRecord = new Record();

// You can also make a record from string representation
var myRecord = Record.fromString(recordString);

```

recordString can be obtained with toString() function.
```

myRecord.toString()

```

```
// set record leader
myRecord.setLeader("00000cam^a22001817i^4500");

// insert controlfields to the record. Proper ordering is handled automatically.
myRecord.insertControlField({
	tag: "001"
	value: "007045872"
});

// or using array as a parameter
myRecord.insertControlField(["001","007045872"]});

// There is also appendControlField, which will append a controlfield to the end of the record.

// insert datafields to the record. Proper ordering is handled automatically.
myRecord.appendField({
	tag: "245",
	ind1: "",
	ind2: "",
	subfields: [
		{
			code: "a"
			value: "The title of the book"
		},
		{
			code: "c",
			value: "Some author"
		}
	]
});

// or using array as a parameter
// Format is [tag,ind1,ind2,sub1code,sub1value,sub2code,sub2value,...subNcode,subNvalue]
myRecord.insertControlField(["245","","", "a","The title of the book'","b","Some author"]});


// get array of controlfields
myRecord.getControlfields();

// get array of datafields
myRecord.getDatafields();


// record has field attribute chat contains an array of all the fields in the record
myRecord.fields

// A deep copy of the record can be made by passing the fields from a record to the constructor of new record:

var deepClonedRecord = new Record(myRecord.fields);


```


## See also

To serialize marc records to other formats, see [marc-record-serializers](https://github.com/petuomin/marc-record-serializers)
