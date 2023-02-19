"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceExtension = void 0;
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var builder_model_1 = require("../../builder/builder-model");
var utility_1 = require("../../utility");
var basic_extension_1 = require("../basic/basic.extension");
var calculator_constant_1 = require("../constant/calculator.constant");
var InstanceExtension = /** @class */ (function (_super) {
    tslib_1.__extends(InstanceExtension, _super);
    function InstanceExtension() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buildFieldList = [];
        return _this;
    }
    InstanceExtension.createInstance = function () {
        return {
            current: null,
            onMounted: function () { return void (0); },
            onDestory: function () { return void (0); },
            detectChanges: function () { return undefined; },
            destory: new rxjs_1.Subject().pipe((0, rxjs_1.shareReplay)(1))
        };
    };
    InstanceExtension.prototype.extension = function () {
        this.buildFieldList = this.mapFields(this.jsonFields, this.addInstance.bind(this));
        var handler = this.eachFields.bind(this, this.jsonFields, this.createInstanceLife.bind(this));
        this.pushCalculators(this.json, [{
                action: this.bindCalculatorAction(handler),
                dependents: { type: calculator_constant_1.LOAD_ACTION, fieldId: this.builder.id }
            }]);
    };
    InstanceExtension.prototype.createInstanceLife = function (_a) {
        var _b;
        var builderField = _a[1];
        var instance = builderField.instance, _c = builderField.events, events = _c === void 0 ? {} : _c;
        this.definePropertys(instance, (_b = {},
            _b[this.getEventType(calculator_constant_1.MOUNTED)] = events.onMounted,
            _b[this.getEventType(calculator_constant_1.DESTORY)] = events.onDestory,
            _b));
        Object.defineProperty(instance, calculator_constant_1.CURRENT, this.getCurrentProperty(builderField));
        delete events.onMounted;
        delete events.onDestory;
    };
    InstanceExtension.prototype.getCurrentProperty = function (_a) {
        var instance = _a.instance, id = _a.id;
        var _current;
        var get = function () { return _current; };
        var set = function (current) {
            var hasMounted = !!current && _current !== current;
            _current = current;
            if (hasMounted) {
                instance.onMounted(id);
            }
            if (current instanceof builder_model_1.BuilderModel && current.id !== id) {
                console.info("Builder needs to set the id property: ".concat(id));
            }
        };
        return { get: get, set: set };
    };
    InstanceExtension.prototype.addInstance = function (_a) {
        var jsonField = _a[0], builderField = _a[1];
        var destory = { type: calculator_constant_1.DESTORY, after: this.bindCalculatorAction(this.instanceDestory.bind(this)) };
        var instance = InstanceExtension.createInstance();
        this.pushAction(jsonField, [destory, { type: calculator_constant_1.MOUNTED }]);
        this.defineProperty(builderField, calculator_constant_1.INSTANCE, instance);
        instance.destory.subscribe();
    };
    InstanceExtension.prototype.instanceDestory = function (_a) {
        var actionEvent = _a.actionEvent, instance = _a.builderField.instance;
        var currentIsBuildModel = instance.current instanceof builder_model_1.BuilderModel;
        instance.current && (instance.current = null);
        instance.detectChanges = function () { return undefined; };
        return !currentIsBuildModel && instance.destory.next(actionEvent);
    };
    InstanceExtension.prototype.beforeDestory = function () {
        var _this = this;
        var showFields = this.buildFieldList.filter(function (_a) {
            var visibility = _a.visibility;
            return _this.builder.showField(visibility);
        });
        if (!(0, lodash_1.isEmpty)(showFields)) {
            return (0, utility_1.toForkJoin)(showFields.map(function (_a) {
                var id = _a.id, instance = _a.instance;
                return new rxjs_1.Observable(function (subscribe) {
                    instance.destory.subscribe(function () {
                        subscribe.next(id);
                        subscribe.complete();
                    });
                });
            })).pipe((0, utility_1.observableMap)(function () { return (0, utility_1.transformObservable)(_super.prototype.beforeDestory.call(_this)); }));
        }
    };
    InstanceExtension.prototype.destory = function () {
        var _this = this;
        this.buildFieldList.forEach(function (buildField) {
            var instance = buildField.instance;
            instance.destory.unsubscribe();
            _this.unDefineProperty(instance, ['detectChanges', _this.getEventType(calculator_constant_1.DESTORY), _this.getEventType(calculator_constant_1.MOUNTED), calculator_constant_1.CURRENT]);
            _this.defineProperty(buildField, calculator_constant_1.INSTANCE, null);
        });
        return _super.prototype.destory.call(this);
    };
    return InstanceExtension;
}(basic_extension_1.BasicExtension));
exports.InstanceExtension = InstanceExtension;
