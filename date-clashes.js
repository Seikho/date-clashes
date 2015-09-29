var Clash = (function () {
    function Clash(rangeGetter) {
        this.getRange = function (dates) { return dates; };
        if (!rangeGetter)
            return;
        this.getRange = rangeGetter;
    }
    Clash.prototype.flatten = function (dates, options) {
        var _this = this;
        options = options || { startDay: null, endDay: null };
        var objects = dates.map(function (d) {
            var range = _this.getRange(d);
            range.value = d;
            return range;
        });
        var allValidRanges = objects.every(this.isRange);
        if (!allValidRanges)
            throw new Error("Invalid range objects in range collection. RangeGetter must return type { start: Date, end: Date }");
        var extremities = this.getExtremities(objects);
        if (options.startDay != null)
            extremities.start = this.floorDate(extremities.start, options.startDay);
        if (options.endDay != null)
            extremities.end = this.ceilingDate(extremities.end, options.endDay);
        var start = this.floorDate(extremities.start);
        var clashes = {
            start: extremities.start,
            end: extremities.end
        };
        var index = 1;
        while (start < extremities.end) {
            var end = this.ceilingDate(start);
            var clashRange = { start: start, end: end };
            var innerClashes = [];
            clashes[index] = {
                date: start,
                clashes: objects
                    .filter(function (range) { return _this.isDateClashing(clashRange, range); })
                    .map(function (o) { return o.value; })
            };
            start = end;
            ++index;
        }
        return clashes;
    };
    Clash.prototype.getExtremities = function (dates) {
        var _this = this;
        var lowerBound = null;
        var upperBound = null;
        dates.forEach(function (date) {
            var range = _this.getRange(date);
            var floor = _this.floorDate(range.start);
            var ceil = _this.ceilingDate(range.end);
            var floorIsLower = lowerBound == null || floor < lowerBound;
            if (floorIsLower)
                lowerBound = floor;
            var ceilIsHigher = upperBound == null || ceil > upperBound;
            if (ceilIsHigher)
                upperBound = ceil;
        });
        return {
            start: lowerBound,
            end: upperBound
        };
    };
    Clash.prototype.floorDate = function (date, day) {
        if (day < 0 || day > 6)
            day = null;
        var downDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (day == null || downDate.getDay() === day)
            return downDate;
        while (downDate.getDay() !== day)
            downDate.setDate(downDate.getDate() - 1);
        return downDate;
    };
    Clash.prototype.ceilingDate = function (date, day) {
        if (day < 0 || day > 6)
            day = null;
        var upDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        if (day == null || upDate.getDay() === day)
            return upDate;
        while (upDate.getDay() !== day)
            upDate.setDate(upDate.getDate() + 1);
        return upDate;
    };
    Clash.prototype.isDateClashing = function (leftRange, rightRange) {
        var startsWithin = rightRange.start >= leftRange.start && rightRange.start <= leftRange.end;
        var endsWithin = rightRange.end >= leftRange.start && rightRange.end <= leftRange.end;
        var rightEncapsulates = rightRange.start <= leftRange.start && rightRange.end >= leftRange.end;
        var leftEncapsulates = leftRange.start <= rightRange.start && leftRange.end >= rightRange.end;
        return startsWithin || endsWithin || rightEncapsulates || leftEncapsulates;
    };
    Clash.prototype.isRange = function (range) {
        var startIsDate = range.start instanceof Date;
        var endIsDate = range.end instanceof Date;
        return startIsDate && endIsDate;
    };
    return Clash;
})();
exports.Clash = Clash;
