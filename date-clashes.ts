import Types = require("date-clashes"); 
import RangeGetter = Types.RangeGetter;
import Range = Types.Range;
import Clashes = Types.Clashes;

export class Clash implements Types.Clash {
    constructor(rangeGetter?: RangeGetter) {
        if (!rangeGetter) return;

        this.getRange = rangeGetter;
    }

    getRange: RangeGetter = (dates: any) => dates;

    flatten(dates: any[]) {
        var extremities = this.getExtremities(dates);

        var start = this.floorDate(extremities.start);
        var clashes: Clashes = {
            start: extremities.start,
            end: extremities.end
        };

        var ranges = dates.map(this.getRange);
        var allValidRanges = ranges.every(this.isRange);
        if (!allValidRanges) throw new Error("Invalid range objects in range collection. RangeGetter must return type { start: Date, end: Date }");

        var index = 1;
        while (start < extremities.end) {
            var end = this.ceilingDate(start);            
            var clashRange = { start, end };

            var innerClashes = [];
            
            clashes[index] = {
                date: start,
                clashes: ranges.filter(range => this.isDateClashing(clashRange, range))
            };

            start = end;
            ++index;
        }
        
        return clashes;
    }

    getExtremities(dates: any[]) {
        var lowerBound = null;
        var upperBound = null;

        dates.forEach(date => {
            var range = this.getRange(date);
            var floor = this.floorDate(range.start);
            var ceil = this.ceilingDate(range.end);

            var floorIsLower = lowerBound == null || floor < lowerBound;
            if (floorIsLower) lowerBound = floor;

            var ceilIsHigher = upperBound == null || ceil > upperBound;
            if (ceilIsHigher) upperBound = ceil;
        });

        return {
            start: lowerBound,
            end: upperBound
        };
    }

    floorDate(date: Date): Date {
        var downDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return downDate;
    }

    ceilingDate(date: Date): Date {
        var upDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        return upDate;
    }

    isDateClashing(leftRange: { start: Date, end: Date }, rightRange: Range) {

        var startsWithin = rightRange.start >= leftRange.start && rightRange.start <= leftRange.end;
        var endsWithin = rightRange.end >= leftRange.start && rightRange.end <= leftRange.end;

        return startsWithin || endsWithin;
    }

    isRange(range: Range): boolean {
        var startIsDate = range.start instanceof Date;
        var endIsDate = range.end instanceof Date;

        return startIsDate && endIsDate;
    }
}

