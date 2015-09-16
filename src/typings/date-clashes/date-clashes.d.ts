declare module "date-clashes" {
    class Clash {
        constructor(rangeGetter?: RangeGetter);
        
        getRange: RangeGetter;
        flatten(dates: any[], options?: Options): Clashes;
        getExtremities(dates: any[]): Range;
        floorDate(date: Date): Date;
        ceilingDate(date: Date): Date;
        isRange(range: Range): boolean;
        
        
    }

    interface RangeGetter {
        (dates: any): Range;
    }

    interface Range {
        start: Date,
        end: Date,
        [key: string]: any;
    }

    interface Clashes {
        start: Date;
        end: Date;
        [index: number]: { date: Date, clashes: Range[] }
    }
    
    interface Options {
        startDay?: number;
        endDay?: number;
    }
}

