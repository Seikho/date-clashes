export = Clash;

class Clash {
    constructor(rangeGetter: RangeGetter) {
        this.getRange = rangeGetter;
    }

    getRange: RangeGetter;

    flatten(dates: any[]) {
        var extremities = this.getExtremities(dates);

        var start = this.floorDate(extremities.start);
        var clashes: any = {};
        var ranges = dates.map(this.getRange);
        var index = 1;
        while (start < extremities.end) {
            var end = this.ceilingDate(start);
            var clashRange = { start, end };
            
            var innerClashes = [];
            
            clashes[index].clashes = ranges.filter(range => this.isDateClashing(clashRange, range));
            clashes[index].date = start;

            start = end;
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
        var upDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        return upDate;
    }

    isDateClashing(leftRange: { start: Date, end: Date }, rightRange: Range) {

        var startsWithin = rightRange.start >= leftRange.start && rightRange.start <= leftRange.end;
        var endsWithin = rightRange.end >= leftRange.start && rightRange.end <= leftRange.end;

        return startsWithin || endsWithin;
    }
}

interface RangeGetter {
    (dates: any): Range;
}

interface Range {
    start: Date,
    end: Date,
    id: any;
    [key: string]: any;
}