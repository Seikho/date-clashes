var Clash = (function () {
    function Clash(rangeGetter) {
        this.getRange = function (dates) { return dates; };
        if (!rangeGetter)
            return;
        this.getRange = rangeGetter;
    }
    Clash.prototype.flatten = function (dates) {
        var _this = this;
        var extremities = this.getExtremities(dates);
        var start = this.floorDate(extremities.start);
        var clashes = {
            start: extremities.start,
            end: extremities.end
        };
        var ranges = dates.map(this.getRange);
        var allValidRanges = ranges.every(this.isRange);
        if (!allValidRanges)
            throw new Error("Invalid range objects in range collection. RangeGetter must return type { start: Date, end: Date }");
        var index = 1;
        while (start < extremities.end) {
            var end = this.ceilingDate(start);
            var clashRange = { start: start, end: end };
            var innerClashes = [];
            clashes[index].clashes = ranges.filter(function (range) { return _this.isDateClashing(clashRange, range); });
            clashes[index].date = start;
            start = end;
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
    Clash.prototype.floorDate = function (date) {
        var downDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return downDate;
    };
    Clash.prototype.ceilingDate = function (date) {
        var upDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
        return upDate;
    };
    Clash.prototype.isDateClashing = function (leftRange, rightRange) {
        var startsWithin = rightRange.start >= leftRange.start && rightRange.start <= leftRange.end;
        var endsWithin = rightRange.end >= leftRange.start && rightRange.end <= leftRange.end;
        return startsWithin || endsWithin;
    };
    Clash.prototype.isRange = function (range) {
        var startIsDate = range.start instanceof Date;
        var endIsDate = range.end instanceof Date;
        return startIsDate && endIsDate;
    };
    return Clash;
})();
module.exports = Clash;
//# sourceMappingURL=date-clashes.js.map