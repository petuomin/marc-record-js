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
```

### Creating a record 
```
// Create empty record
var myRecord = new Record();

// You can also make a record from string representation
var myRecord = Record.fromString(recordString);

```

recordString can be obtained with `toString()` function.
```
myRecord.toString()
```
The output of `toString()` is human-readable. Example:
```
LDR    leader
001    28474
100    ‡aExample Author
245 0  ‡aExample Title
500 #  ‡aNote‡bSecond subfield
```

### Mutating record
```
// set record leader
myRecord.setLeader("00000cam^a22001817i^4500");

// insert controlfields to the record. Proper ordering is handled automatically.
myRecord.insertControlField({
	tag: "001"
	value: "007045872"
});

// or using array as a parameter
myRecord.insertControlField(["001", "007045872"]});

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
myRecord.insertField(["245","","", "a","The title of the book'","b","Some author"]});
```

### Getters

Get array of controlfields:
```
myRecord.getControlfields();
```

Get array of datafields:
```
myRecord.getDatafields();
```

Record object has an attribute called `fields` which contains an array of it's fields:
```
myRecord.fields
```

Check if record is deleted:
```
myRecord.isDeleted()
```

### Cloning a record

A deep copy of the record can be made by passing the fields from a record to the constructor of new record:
```
var deepClonedRecord = Record.clone(myRecord);
```

### Record equality check

```
Record.isEqual(record1, record2); // true if records are deeply equal.
```

Alternative form for equality comparison:
```
record1.equalsTo(record2);
```

### Simple assertions

Check if record contains a data field with specific value
```
record.containsFieldWithValue('245', 'b', 'Test field', 'c', 'Test content')
```


Check if record contains a control field with specific value
```
record.containsFieldWithValue('003', 'some value')
```


## See also

To serialize marc records to other formats, see [marc-record-serializers](https://github.com/petuomin/marc-record-serializers)
