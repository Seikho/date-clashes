import DateClash = require("../date-clashes");
import chai = require("chai");
var expect = chai.expect;

var sampleDate = [
    { start: new Date(), end: newDate(1) },
    { start: new Date(), end: newDate(1) },
    { start: newDate(2), end: newDate(3) },
    { start: newDate(5), end: newDate(6) },
    { start: newDate(8), end: newDate(8) },
    { start: newDate(8), end: newDate(8) },
]

var clash = new DateClash.Clash();
var clashes = clash.flatten(sampleDate);
console.log(clashes);

describe("Date clash tests", () => {

    it("will correctly calculate extremities", () => {
        expect(isSameDate(clashes.start, floor(new Date()))).to.be.true;
        expect(isSameDate(clashes.end, ceil(newDate(8)))).to.be.true;
    });
    
    it("will correctly calculate extremities when provided startDay and endDay options", () => {
        var innerClashes = clash.flatten(sampleDate, { startDay: 0, endDay: 6 });
        var start = innerClashes.start;
        var end = innerClashes.end;
        var now = new Date();
        var future = newDate(8);
        expect(start < now).to.be.true;
        expect(future < end).to.be.true;
        expect(start.getDay()).to.equal(0);
        expect(end.getDay()).to.equal(6);
    });
    
    it("will have the correct amount of day properties", () => {
        expect(Object.keys(clashes).length).to.equal(11);
    });
    
    it("will evaluate the entries in the first two days to be equivalent", () => {
       var left = clashes['1'].clashes;
       var right = clashes['2'].clashes;
       
       expect(left[0] === right[0]).to.be.true;
       expect(left[1] === right[1]).to.be.true;
    });
    
    it("will not find any entries on a days that should be empty", () => {
       expect(clashes['5'].clashes.length).to.equal(0);
       expect(clashes['8'].clashes.length).to.equal(0); 
    });
   
});

function addDays(days: number, date: Date) {
    var newDate = date;
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

function newDate(days: number) {
    return addDays(days, new Date());
}

function isSameDate(left: Date, right: Date) {
    var sameYear = left.getFullYear() === right.getFullYear();
    var sameMonth = left.getMonth() === right.getMonth();
    var sameDay = left.getDate() === right.getDate();

    return sameDay && sameMonth && sameYear;
}

function floor(date: Date) {
    return clash.floorDate(date);
}

function ceil(date: Date) {
    return clash.ceilingDate(date);
}