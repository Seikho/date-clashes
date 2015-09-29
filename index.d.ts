export class Clash {
    constructor(rangeGetter?: RangeGetter);

    getRange: RangeGetter;
    flatten(dates: any[], options?: Options): Clashes;
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

export interface Clashes {
    start: Date;
    end: Date;
    [index: number]: { date: Date, clashes: Range[] }
}

export interface Options {
    startDay?: number;
    endDay?: number;
}

