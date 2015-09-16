### date-clashes
A simple API for detecting overlapping dates

### Installation
`npm install date-clashes --save`

### Usage
```javascript
var myDates = [
   { s: /* Date */, e: /* Date */ , id: 1 },
   { s: /* Date */, e: /* Date */ , id: 2 },
   ...
];

var DateClash = require("date-clashes");

// Supply the constructor with instructions on how to parse your date objects
// The function must return an object that matches the 'Range' interface below
var clash = new DateClash.Clash(date => { return { start: date.s, end: date.e, id: date.id } });

// Detect the clashes
var clashes = clash.flatten(myDates);

// Make the clash 'window'/'extremities' fall on particular days of the week
// 0 = Sunday, 6 = Saturday
var clashes = clash.flatten(myDates, { startDay: 1 /* Monday */, endDay: 0 /* Sunday */ });

// Returns an object of type Clashes that looks like:
{
    start: Tue Sep 15 2015 00:00:00 GMT+0800 (W. Australia Standard Time),
    end: Thu Sep 24 2015 00:00:00 GMT+0800 (W. Australia Standard Time),
    
    '1': { date: Tue Sep 15 2015 00:00:00 GMT+0800 (W. Australia Standard Time),
     clashes: [ ... ] },
     ...
    '10': { date: Tue Sep 24 2015 00:00:00 GMT+0800 (W. Australia Standard Time),
     clashes: [ ... ] },
}


interface Clashes {
    start: Date; // The floored version of the earliest date in your array
    end: Date; // The ceiling version of the latest date in your array
    [dayNumber: number]: { date: Date, clashes: Range[] }
}

interface Range {
    start: Date;
    end: Date;
    [key: string]: any;
}
```

### API

##### Constructor
```javascript
constructor(rangeGetter?: RangeGetter);
```

##### RangeGetter
A function that takes an object and returns an object that `date-clashes` can understand (`Range`)  
The object *must* contain a `start` and `end` property which must be `Date` objects.  

Example:
```javascript
function rangeGetter(myObject) {
    return {
        start: new Date(myObject.startDate),
        end: new Date(myObject.endDate),
        id: myObject.id,
        firstName: myObject.firstName,
        lastName: myObject.lastName
    };
}

var clash = new DateClash.Clash(rangeGetter);
```

##### Flatten
The function that does all of the work.  
Takes an array of objects that your `rangeGetter` function can parse.
```javascript
function flatten(dates: Array<any>, options?: Options) => Clashes;
```

##### Options
An optional object that has two optional properties:  
`startDay` and `endDay`  
These options will determine the day number of outer-extremities of the returned `Clashes` object.

```javascript
{
    startDay: number,
    endDay: number
}
```


### License
MIT