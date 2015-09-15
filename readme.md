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

var Clash = require("date-clashes");

// Supply the constructor with instructions on how to parse your date objects
// The function must return an object that matches the 'Range' interface below
var clash = new Clash(date => { return { start: date.s, end: date.e, id: date.id } });

// Detect the clashes
var clashes = clash.flatten(myDates);

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

### License
MIT