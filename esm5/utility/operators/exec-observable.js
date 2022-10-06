import { map } from 'rxjs/operators';
export function observableMap(fn) {
    return function (souce) { return souce.lift(function (liftedSource) {
        var _this = this;
        liftedSource.subscribe(function (result) { return fn(result).subscribe(_this); });
    }); };
}
export function observableTap(fn) {
    return function (souce) { return souce.lift(function (liftedSource) {
        var _this = this;
        liftedSource.subscribe(function (result) { return fn(result).pipe(map(function () { return result; })).subscribe(_this); });
    }); };
}
