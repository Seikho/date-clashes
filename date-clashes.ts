import * as Types from './index.d.ts';
import RangeGetter = Types.RangeGetter;
import Range = Types.Range;
import Clashes = Types.Clashes;
import Options = Types.Options;

export class Clash implements Types.Clash {
    constructor(rangeGetter?: RangeGetter) {
        if (!rangeGetter) return;

        this.getRange = rangeGetter;
    }

    getRange: RangeGetter = (dates: any) => dates;

    flatten(dates: any[], options?: Options) {
        options = options || { startDay: null, endDay: null };

        var objects = dates.map(d => {
            var range = this.getRange(d);
            range.value = d;
            return range;
        });

        var allValidRanges = objects.every(this.isRange);
        if (!allValidRanges) throw new Error("Invalid range objects in range collection. RangeGetter must return type { start: Date, end: Date }");

        var extremities = this.getExtremities(objects);

        if (options.startDay != null)
            extremities.start = this.floorDate(extremities.start, options.startDay);

        if (options.endDay != null)
            extremities.end = this.ceilingDate(extremities.end, options.endDay);

        var start = this.floorDate(extremities.start);
        var clashes: Clashes = {
            start: extremities.start,
            end: extremities.end
        };

        var index = 1;
        while (start < extremities.end) {
            var end = this.ceilingDate(start);
            var clashRange = { start, end };

            var innerClashes = [];

            clashes[index] = {
                date: start,
                clashes: objects
                    .filter(range => this.isDateClashing(clashRange, range))
                    .map(o => o.value)
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

    floorDate(date: Date, day?: number): Date {
        if (day < 0 || day > 6) day = null;
        var downDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (day == null || downDate.getDay() === day) return downDate;

        while (downDate.getDay() !== day)
            downDate.setDate(downDate.getDate() - 1);

        return downDate;
    }

    ceilingDate(date: Date, day?: number): Date {
        if (day < 0 || day > 6) day = null;
        var upDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        if (day == null || upDate.getDay() === day) return upDate;

        while (upDate.getDay() !== day)
            upDate.setDate(upDate.getDate() + 1);

        return upDate;
    }

    isDateClashing(leftRange: { start: Date, end: Date }, rightRange: Range) {

        var startsWithin = rightRange.start >= leftRange.start && rightRange.start <= leftRange.end;
        var endsWithin = rightRange.end >= leftRange.start && rightRange.end <= leftRange.end;

        var rightEncapsulates = rightRange.start <= leftRange.start && rightRange.end >= leftRange.end;
        var leftEncapsulates = leftRange.start <= rightRange.start && leftRange.end >= rightRange.end;
        return startsWithin || endsWithin || rightEncapsulates || leftEncapsulates;
    }

    isRange(range: Range): boolean {
        var startIsDate = range.start instanceof Date;
        var endIsDate = range.end instanceof Date;

        return startIsDate && endIsDate;
    }
}

