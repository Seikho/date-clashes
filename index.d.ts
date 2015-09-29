export class Clash {
    constructor(rangeGetter?: RangeGetter);

    getRange: RangeGetter;
    flatten(dates: any[], options?: Options): FlattenResult;
    getExtremities(dates: any[]): Range;
    floorDate(date: Date, day?: number): Date;
    ceilingDate(date: Date, day?: number): Date;
    isRange(range: Range): boolean;
}

export interface RangeGetter {
    (dates: any): Range;
}

export interface Range {
    start: Date,
    end: Date,
    value?: any;
}

export interface DayClash {
    date: Date;
    clashes: any[]
}

export interface Options {
    startDay?: number;
    endDay?: number;
}

export interface FlattenResult {
    start: Date;
    end: Date;
    days: { [dayNumber: number]: DayClash };
}
